# Generated by Django 4.2.2 on 2023-09-06 16:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('erp', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='expensegroup',
            name='name',
        ),
        migrations.AddField(
            model_name='expensegroup',
            name='key',
            field=models.CharField(default='', max_length=255, verbose_name='Ключ'),
        ),
        migrations.AddField(
            model_name='expensegroup',
            name='value',
            field=models.CharField(default='', max_length=255, verbose_name='Value'),
        ),
    ]