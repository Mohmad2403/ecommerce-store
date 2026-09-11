from rest_framework.routers import DefaultRouter
from .views import WishlistItemViewSet

router=DefaultRouter()
router.register('wishlist',WishlistItemViewSet,basename='wishlist')
urlpatterns=router.urls