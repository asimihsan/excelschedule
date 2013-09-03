from django.db import models
from django.template.defaultfilters import slugify

from unidecode import unidecode


class Schedule(models.Model):
    title = models.CharField(max_length=100)
    slug = models.SlugField(db_index=True, unique=True, editable=False)

    def __unicode__(self):
        return unicode(self.title)

    def save(self, *args, **kwargs):
        self.slug = slugify(unidecode(self.title))
        super(Schedule, self).save(*args, **kwargs)
