from django.urls import path, include

from rest_framework_nested import routers

from erp import views


router_main = routers.SimpleRouter()
router_main.register('projects', views.ProjectViewSet, basename='project')


router_nested = routers.NestedSimpleRouter(router_main, 'projects', lookup='project')
router_nested.register('products', views.ProductViewSet, basename='product')
router_nested.register('expenses', views.ExpenseViewSet, basename='expense')
router_nested.register('expenses_groups', views.ExpenseGroupViewSet, basename='expense_group')


urlpatterns = [
    path('', include(router_main.urls)),
    path('', include(router_nested.urls)),
]
