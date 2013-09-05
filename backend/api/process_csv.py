#!/usr/bin/env python

import codecs
import csv
import json
import os
import re
import sys

import chardet
from dateutil.parser import parse


def generate_data(filepath):
    assert(os.path.isfile(filepath))
    with open(filepath, 'rb') as csv_fh:
        encoding = chardet.detect(csv_fh.read(1024))['encoding']
    if "UTF-16" in encoding:
        starting_byte = 2
    else:
        starting_byte = 0
    with codecs.open(filepath, 'rb', encoding) as csv_fh:
        csv_fh.read(starting_byte)
        dialect = csv.Sniffer().sniff(csv_fh.read(1024))
        csv_fh.seek(starting_byte)
        for line in csv_fh:
            elems = line.split(dialect.delimiter)
            yield elems


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
    #import ipdb; ipdb.set_trace()
    return_value = json.dumps(rows, cls=CsvRowEncoder)
    return return_value


def main():
    return_value = process_csv(sys.argv[1])
    if "--debug" in sys.argv:
        import pprint
        pprint.pprint(json.loads(return_value))

if __name__ == "__main__":
    sys.exit(main())
