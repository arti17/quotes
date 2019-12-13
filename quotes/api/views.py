from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.views import APIView
from rest_framework.response import Response

from api.serializers import QuoteSerializer
from webapp.models import Quote
from rest_framework import viewsets


class LogoutView(APIView):
    permission_classes = []

    def post(self, request, *args, **kwargs):
        user = self.request.user
        if user.is_authenticated:
            user.auth_token.delete()
        return Response({'status': 'ok'})


class QuoteViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticatedOrReadOnly]
    serializer_class = QuoteSerializer

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return Quote.objects.all()
        return Quote.objects.filter(status='approved')

    def get_permissions(self):
        if self.request.method == 'POST':
            return []
        return super().get_permissions()


class AddRatingView(APIView):
    permission_classes = []

    def post(self, request, *args, **kwargs):
        quote_pk = kwargs.get('pk')
        quote = Quote.objects.get(pk=quote_pk)
        quote.rating += 1
        quote.save()
        return Response({'id': quote.pk, 'rating': quote.rating, 'status': 'ok'})


class SubRatingView(APIView):
    permission_classes = []

    def post(self, request, *args, **kwargs):
        quote_pk = kwargs.get('pk')
        quote = Quote.objects.get(pk=quote_pk)
        quote.rating -= 1
        quote.save()
        return Response({'id': quote.pk, 'rating': quote.rating, 'status': 'ok'})
