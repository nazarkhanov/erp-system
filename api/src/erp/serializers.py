from rest_framework import serializers

import erp.models as models


class ProjectSerializer(serializers.ModelSerializer):
    owner = serializers.PrimaryKeyRelatedField(many=False, read_only=True)

    class Meta:
        model = models.Project
        fields = ['id', 'title', 'status', 'owner']


class ProductSerializer(serializers.ModelSerializer):
    owner = serializers.PrimaryKeyRelatedField(many=False, read_only=True)
    project = serializers.PrimaryKeyRelatedField(many=False, read_only=True)

    class Meta:
        model = models.Product
        fields = ['id', 'name', 'quantity', 'margin', 'unitPrice', 'totalPrice', 'owner', 
                  'project']


class ExpenseSerializer(serializers.ModelSerializer):
    owner = serializers.PrimaryKeyRelatedField(many=False, read_only=True)
    project = serializers.PrimaryKeyRelatedField(many=False, read_only=True)
    group = serializers.PrimaryKeyRelatedField(many=False, read_only=True)

    class Meta:
        model = models.Expense
        fields = ['id', 'name', 'quantity', 'total', 'owner', 'project', 'group']



class ExpenseGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.ExpenseGroup
        fields = ['id', 'key', 'value']
