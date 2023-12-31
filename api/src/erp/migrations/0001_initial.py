# Generated by Django 4.2.2 on 2023-09-03 03:25

from django.conf import settings
import django.contrib.auth.validators
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
    ]

    operations = [
        migrations.CreateModel(
            name='User',
            fields=[
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('is_superuser', models.BooleanField(default=False, help_text='Designates that this user has all permissions without explicitly assigning them.', verbose_name='superuser status')),
                ('username', models.CharField(error_messages={'unique': 'A user with that username already exists.'}, help_text='Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.', max_length=150, unique=True, validators=[django.contrib.auth.validators.UnicodeUsernameValidator()], verbose_name='username')),
                ('is_staff', models.BooleanField(default=False, help_text='Designates whether the user can log into this admin site.', verbose_name='staff status')),
                ('date_joined', models.DateTimeField(default=django.utils.timezone.now, verbose_name='date joined')),
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('email', models.EmailField(max_length=255, unique=True, verbose_name='Имя пользователя')),
                ('first_name', models.CharField(max_length=255, verbose_name='Имя')),
                ('last_name', models.CharField(max_length=255, verbose_name='Фамилия')),
                ('is_active', models.BooleanField(default=True, verbose_name='Это пользователь активный?')),
                ('is_customer', models.BooleanField(default=True, verbose_name='Этот пользователь является клиентом?')),
                ('position', models.CharField(default='Владелец', max_length=255, verbose_name='Должность')),
                ('groups', models.ManyToManyField(blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.', related_name='user_set', related_query_name='user', to='auth.group', verbose_name='groups')),
                ('user_permissions', models.ManyToManyField(blank=True, help_text='Specific permissions for this user.', related_name='user_set', related_query_name='user', to='auth.permission', verbose_name='user permissions')),
            ],
            options={
                'verbose_name': 'user',
                'verbose_name_plural': 'users',
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='ExpenseGroup',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('name', models.CharField(default='', max_length=255, verbose_name='Название')),
            ],
            options={
                'verbose_name': 'Группа затраты',
                'verbose_name_plural': 'Группы затрат',
            },
        ),
        migrations.CreateModel(
            name='Project',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('title', models.CharField(default='Без названия', max_length=255, verbose_name='Название')),
                ('status', models.CharField(choices=[('DRAFT', 'Черновик'), ('IN_WAITING', 'В ожидании'), ('IN_PROGRESS', 'В работе'), ('DONE', 'Выполнено')], default='DRAFT', max_length=100, verbose_name='Статус')),
                ('owner', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='works', to=settings.AUTH_USER_MODEL, verbose_name='Владелец')),
            ],
            options={
                'verbose_name': 'Проект',
                'verbose_name_plural': 'Проекты',
            },
        ),
        migrations.CreateModel(
            name='Product',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('name', models.CharField(default='', max_length=255, verbose_name='Название')),
                ('quantity', models.PositiveIntegerField(default=1, verbose_name='Количество')),
                ('margin', models.FloatField(default=0.0, verbose_name='Маржа (%)')),
                ('unitPrice', models.DecimalField(decimal_places=2, default=0.0, max_digits=15, verbose_name='Цена за единицу (тг)')),
                ('totalPrice', models.DecimalField(decimal_places=2, default=0.0, max_digits=15, verbose_name='Итоговая цена (тг)')),
                ('owner', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='+', to=settings.AUTH_USER_MODEL, verbose_name='Владелец')),
                ('project', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='products', to='erp.project')),
            ],
            options={
                'verbose_name': 'Товар',
                'verbose_name_plural': 'Товары',
            },
        ),
        migrations.CreateModel(
            name='Expense',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('name', models.CharField(default='', max_length=255, verbose_name='Название')),
                ('totalPrice', models.DecimalField(decimal_places=2, default=0.0, max_digits=15, verbose_name='Итоговые затраты (тг)')),
                ('group', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='+', to='erp.expensegroup', verbose_name='Группа затраты')),
                ('owner', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='+', to=settings.AUTH_USER_MODEL, verbose_name='Владелец')),
                ('project', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='expenses', to='erp.project')),
            ],
            options={
                'verbose_name': 'Затрата',
                'verbose_name_plural': 'Затраты',
            },
        ),
    ]
