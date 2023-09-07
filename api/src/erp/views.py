from django.shortcuts import get_object_or_404
from rest_framework import viewsets, permissions, mixins, response

import erp.models as models
import erp.serializers as serializers 
import erp.permissions as user_permissions


class ProjectViewSet(viewsets.ModelViewSet):
    queryset = models.Project.objects.all()
    serializer_class = serializers.ProjectSerializer
    permission_classes = [permissions.IsAuthenticated, user_permissions.IsOwner]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class ProductViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.ProductSerializer
    permission_classes = [permissions.IsAuthenticated, user_permissions.IsOwner]

    def get_queryset(self):
        return models.Product.objects.filter(owner=self.request.user, 
                                             project__id=self.kwargs['project_pk'])

    def perform_create(self, serializer):
        project = get_object_or_404(models.Project, pk=self.kwargs['project_pk'])
        serializer.save(owner=self.request.user, project=project)


class ExpenseViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.ExpenseSerializer
    permission_classes = [permissions.IsAuthenticated, user_permissions.IsOwner]

    def get_queryset(self):
        return models.Expense.objects.filter(owner=self.request.user,
                                             project=self.kwargs['project_pk'])

    def perform_create(self, serializer):
        project = get_object_or_404(models.Project, pk=self.kwargs['project_pk'])
        group = get_object_or_404(models.ExpenseGroup, pk=self.request.data['group_id'])
        serializer.save(owner=self.request.user, project=project, group=group)

    def retrieve(self, request, pk=None, project_pk=None):
        expenses = models.Expense.objects.filter(owner=self.request.user,
                                                 project__id=project_pk,
                                                 group__id=pk)
        serializer = self.get_serializer(expenses, many=True)
        return response.Response(serializer.data)


class ExpenseGroupViewSet(mixins.ListModelMixin, viewsets.GenericViewSet):
    serializer_class = serializers.ExpenseGroupSerializer
    permission_classes = [permissions.IsAuthenticated, user_permissions.IsOwner]

    def get_queryset(self):
        return models.ExpenseGroup.objects.all()
