import django.contrib.admin as admin
import django.contrib.auth.admin as auth_admin

import erp.models as models


@admin.register(models.User)
class UserAdmin(auth_admin.UserAdmin):
    list_display = ('email', 'first_name', 'last_name')
