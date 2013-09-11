#!/usr/bin/env python

import codecs
import csv
import json
import os
import re
from string import Template
import sys

import chardet
from dateutil.parser import parse
import ply.lex as lex
import unicodedata


def add_doc(value):
    def _doc(func):
        func.__doc__ = value
        return func
    return _doc


def make_csv_lexer(dialect):

    class CsvLexer(object):
        tokens = (
            'QUOTED_STRING',
            'DOUBLE_DELIMITER',
            'DELIMITER',
            'UNQUOTED_STRING',
        )

        quoted_string_template = \
            Template(r'${qc}(?:[^${qc}]|${qc}${qc})*${qc}')

        @add_doc(quoted_string_template.substitute(qc=dialect.quotechar))
        def t_QUOTED_STRING(self, token):
            token.value = unicodedata.normalize('NFKD', token.value[1:-1])
            return token

        @add_doc(r'[%s]{2}' % dialect.delimiter)
        def t_DOUBLE_DELIMITER(self, token):
            return token

        @add_doc(r'[%s]' % dialect.delimiter)
        def t_DELIMITER(self, token):
            return token

        unquote_string_template = Template(r'[^${qc}${d}]+')

        @add_doc(unquote_string_template.substitute(qc=dialect.quotechar,
                                                    d=dialect.delimiter))
        def t_UNQUOTED_STRING(self, token):
            return token

        # Error handling rule
        def t_error(self, t):
            print "Illegal character at %s: '%s'" % (t.lexpos, t.value[0])
            t.lexer.skip(1)

        # Ignored characters
        t_ignore = '\n'

        # Build the lexer
        def build(self, **kwargs):
            self.lexer = lex.lex(module=self, **kwargs)

        def test(self, data):
            self.lexer.input(data)
            while True:
                t = self.lexer.token()
                if not t:
                    break
                yield t

    return CsvLexer


def generate_data(filepath):
    assert(os.path.isfile(filepath))
    with open(filepath, 'rb') as csv_fh:
        start = csv_fh.read(1024)
    encoding = chardet.detect(start)['encoding']
    starting_byte = 0
    for bom in [getattr(codecs, var) for var in vars(codecs)
                if var.startswith("BOM")]:
        if start.startswith(bom):
            starting_byte = len(bom)
    with codecs.open(filepath, 'rb', encoding) as csv_fh:
        csv_fh.read(starting_byte)
        dialect = csv.Sniffer().sniff(csv_fh.read(1024))
        csv_fh.seek(starting_byte)
        lexer = make_csv_lexer(dialect)()
        lexer.build()
        for line in csv_fh:
            yield_value = []
            for token in lexer.test(line.strip()):
                if token.type == "DELIMITER":
                    continue
                elif token.type == "DOUBLE_DELIMITER":
                    yield_value.extend([u"", u""])
                else:
                    yield_value.append(token.value)
            yield yield_value


class Header(object):
    def __init__(self, first_line, second_line):
        self.first_line = [elem.strip() for elem in first_line]
        self.second_line = [elem.strip() for elem in second_line]
        self.first_line_lookup = \
            dict((v, k) for (k, v) in enumerate(self.first_line))
        self.second_line_lookup = \
            dict((v, k) for (k, v) in enumerate(self.second_line))
        self.first_line_reverse_lookup = \
            dict((k, v) for (k, v) in enumerate(self.first_line))
        self.second_line_reverse_lookup = \
            dict((k, v) for (k, v) in enumerate(self.second_line))

    def get_column_index(self, column_name):
        for lookup in [self.first_line_lookup, self.second_line_lookup]:
            return_value = lookup.get(column_name, None)
            if return_value:
                return return_value
        return None

    def get_column_name(self, column_index):
        for lookup in [self.second_line_reverse_lookup]:
            return_value = lookup.get(column_index, None)
            if return_value:
                return return_value
        return None

    def get_column_indexes_by_filter(self, filter):
        return_value = set()
        matcher = re.compile(filter)
        for lookup in [self.first_line_lookup, self.second_line_lookup]:
            for (k, v) in lookup.items():
                if matcher.search(k):
                    return_value.add(v)
        return sorted(list(return_value))


re_maybe_quoted = re.compile(r'^["]?(.*?)["]?$')


def get_unquoted_string(input):
    return re_maybe_quoted.match(input).groups(0)[0]


def unquote_string(func):
    def inner_func(*args, **kwargs):
        return_value = func(*args, **kwargs)
        return get_unquoted_string(return_value)
    return inner_func


class CsvRow(object):
    def __init__(self, header, row):
        self.header = header
        self.row = row

    @property
    def start_date(self):
        return parse(self.row[self.header.get_column_index("StartDate")])

    @property
    def end_date(self):
        return parse(self.row[self.header.get_column_index("EndDate")])

    @property
    @unquote_string
    def name(self):
        return self.row[self.header.get_column_index("Name:")]

    @property
    @unquote_string
    def course_title(self):
        return self.row[self.header.get_column_index("title")]

    @property
    @unquote_string
    def course_number(self):
        return self.row[self.header.get_column_index("Course #:")]

    def _get_choices(self, choice_filter):
        return_value = []
        for column_index in \
                self.header.get_column_indexes_by_filter(choice_filter):
            value = get_unquoted_string(self.row[column_index])
            if len(value.strip()) == 0:
                continue
            column_name = get_unquoted_string(
                self.header.get_column_name(column_index))
            column_name = column_name.split("-")[-1]
            return_value.append((column_name, value))
        return return_value

    @property
    def first_choices(self):
        return self._get_choices("^1st choice")

    @property
    def second_choices(self):
        return self._get_choices("^2nd choice")

    @property
    def third_choices(self):
        return self._get_choices("^3rd choice")

    @property
    @unquote_string
    def other_additional_availability(self):
        return self.row[self.header.get_column_index(r'Other/Additional '
                                                     'Availability:')]

    @property
    @unquote_string
    def other_preferred_times(self):
        index = self.header.get_column_indexes_by_filter(
            r'If your preferred days')[0]
        return self.row[index]

    @property
    def unavailable_times(self):
        return self._get_choices(r'Days/Times that you are NOT available to '
                                 'teach')

    @property
    @unquote_string
    def no_conflict_courses(self):
        return self.row[self.header.get_column_index(
            r'Other COURSES with which your class should NOT conflict:')]

    @property
    @unquote_string
    def other_comments(self):
        return self.row[self.header.get_column_index(r'Other comments:')]


class CsvRowEncoder(json.JSONEncoder):
    def default(self, o):
        return {
            "start_date": o.start_date.isoformat(" "),
            "end_date": o.end_date.isoformat(" "),
            "name": o.name,
            "course_title": o.course_title,
            "course_number": o.course_number,
            "first_choices": o.first_choices,
            "second_choices": o.second_choices,
            "third_choices": o.third_choices,
            "other_additional_availability":
            o.other_additional_availability,
            "other_preferred_times": o.other_preferred_times,
            "unavailable_times": o.unavailable_times,
            "no_conflict_courses": o.no_conflict_courses,
            "other_comments": o.other_comments,
        }


def process_csv(filepath):
    data = generate_data(filepath)
    first_line = data.next()
    second_line = data.next()
    header = Header(first_line, second_line)
    rows = [CsvRow(header, line) for line in data]
    return_value = json.dumps(rows, cls=CsvRowEncoder)
    return return_value


def main():
    return_value = process_csv(sys.argv[1])
    if "--debug" in sys.argv:
        import pprint
        pprint.pprint(json.loads(return_value)[0])

if __name__ == "__main__":
    sys.exit(main())
