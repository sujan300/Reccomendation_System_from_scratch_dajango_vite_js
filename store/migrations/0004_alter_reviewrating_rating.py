# Generated by Django 5.1.2 on 2024-11-12 17:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('store', '0003_reviewrating'),
    ]

    operations = [
        migrations.AlterField(
            model_name='reviewrating',
            name='rating',
            field=models.FloatField(default=0.0),
        ),
    ]
