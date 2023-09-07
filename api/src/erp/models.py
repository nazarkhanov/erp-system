import uuid

import django.db.models as models 
import django.contrib.auth.models as auth_models

from django.utils.translation import gettext as _


class UserManager(auth_models.BaseUserManager):
    def create_user(self, email, password, **extra_fields):
        if not email:
            raise ValueError(_('Users must have an email address'))

        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)

        user.set_password(password)
        user.save()

        return user

    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_customer', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError(_('Superuser must have is_staff=True.'))
        if extra_fields.get('is_customer') is not True:
            raise ValueError(_('Superuser must have is_customer=True.'))
        if extra_fields.get('is_superuser') is not True:
            raise ValueError(_('Superuser must have is_superuser=True.'))

        return self.create_user(email, password, **extra_fields)


class User(auth_models.AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    email = models.EmailField(_('Username'), max_length=255, unique=True)
    first_name = models.CharField(_('First name'), max_length=255, blank=False)
    last_name = models.CharField(_('Last name'), max_length=255, blank=False)
    is_active = models.BooleanField(_('Is user active?'), default=True)
    is_customer = models.BooleanField(_('Is user customer?'), default=True)
    position = models.CharField(_('Position'), max_length=255, default=_('Owner'), blank=False)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name', 'position']

    def __str__(self):
        return self.email


class Project(models.Model):
    class Meta:
        verbose_name = _('Project')
        verbose_name_plural = _('Projects')

    class StatusChoices(models.TextChoices):
        DRAFT = 'DRAFT', _('Draft')
        IN_WAITING = 'IN_WAITING', _('In waiting')
        IN_PROGRESS = 'IN_PROGRESS', _('In progress')
        DONE = 'DONE', _('Done')

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    owner = models.ForeignKey(User, related_name='works', on_delete=models.CASCADE, blank=False, 
                              null=False, verbose_name=_('Owner'))

    title = models.CharField(_('Title'), max_length=255, default=_('Untitled'), blank=False)
    status = models.CharField(_('Status'), max_length=100, default=StatusChoices.DRAFT, 
                              choices=StatusChoices.choices, blank=False)

    REQUIRED_FIELDS = ['title', 'status']

    def __str__(self):
        return self.title


class Product(models.Model):
    class Meta:
        verbose_name = _('Product')
        verbose_name_plural = _('Products')

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    project = models.ForeignKey(Project, related_name='products', on_delete=models.CASCADE, 
                                blank=False, null=False)
    owner = models.ForeignKey(User, related_name='+', on_delete=models.CASCADE, blank=False, 
                              null=False, verbose_name=_('Owner'))

    name = models.CharField(_('Name'), default='', max_length=255, blank=False)
    quantity = models.PositiveIntegerField(_('Quantity'), default=1, blank=False)
    margin = models.FloatField(_('Margin'), default=0.0, blank=False)
    unitPrice = models.DecimalField(_('Unit price'), max_digits=15, decimal_places=2, 
                                      default=0.0, blank=False)
    totalPrice = models.DecimalField(_('Total price'), max_digits=15, decimal_places=2, 
                                     default=0.0, blank=False)

    REQUIRED_FIELDS = ['name']

    def __str__(self):
        return self.name


class ExpenseGroup(models.Model):
    class Meta:
        verbose_name = _('Expense group')
        verbose_name_plural = _('Expense groups')

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    key = models.CharField(_('Key'), default='', max_length=255, blank=False)
    value = models.CharField(_('Value'), default='', max_length=255, blank=False)

    REQUIRED_FIELDS = ['name']

    def __str__(self):
        return self.name


class Expense(models.Model):
    class Meta:
        verbose_name = _('Expense')
        verbose_name_plural = _('Expenses')

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    project = models.ForeignKey(Project, related_name='expenses', on_delete=models.CASCADE, 
                                blank=False, null=False)
    group = models.ForeignKey(ExpenseGroup, related_name='+', on_delete=models.CASCADE, 
                              blank=False, null=False, verbose_name=_('Expense group'))
    owner = models.ForeignKey(User, related_name='+', on_delete=models.CASCADE, blank=False, 
                              null=False, verbose_name=_('Owner'))

    name = models.CharField(_('Name'), default='', max_length=255, blank=False)
    quantity = models.PositiveIntegerField(_('Quantity'), default=1, blank=False)
    total = models.DecimalField(_('Total expenses'), max_digits=15, decimal_places=2, 
                                     default=0.0, blank=False)

    REQUIRED_FIELDS = ['name']

    def __str__(self):
        return self.name
