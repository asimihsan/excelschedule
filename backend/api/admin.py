from django.contrib import admin
from models import Schedule


class ScheduleAdmin(admin.ModelAdmin):
    list_display = ('title', 'slug')
    readonly_fields = ('slug', )
    search_fields = ['title']

admin.site.register(Schedule, ScheduleAdmin)
