# Generated by Django 5.1.1 on 2024-09-14 21:15

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0005_alter_establecimiento_options_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='EtiquetaEstablecimiento',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('id_establecimiento', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.establecimiento')),
                ('id_etiqueta', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.etiqueta')),
            ],
        ),
    ]