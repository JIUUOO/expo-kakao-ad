import { requireNativeModule } from "expo-modules-core";

export interface ExpoKakaoAdModule {
  activate(): Promise<void>;
  sendCompleteRegistrationEvent(tag?: string): void;
  sendLoginEvent(tag?: string): void;
  sendSearchEvent(tag?: string, searchString?: string): void;
  sendViewContentEvent(tag?: string, contentId?: string): void;
  sendAddToWishListEvent(tag?: string, contentId?: string): void;
  sendAddToCartEvent(tag?: string, contentId?: string): void;
  sendViewCartEvent(tag?: string): void;
  sendPurchaseEvent(
    tag: string | null,
    totalQuantity: number,
    totalPrice: number,
    currency: string | null,
    products: KakaoAdDetailProduct[]
  ): void;
  sendInAppPurchaseEvent(
    tag: string | null,
    totalQuantity: number,
    totalPrice: number,
    currency: string | null,
    products: KakaoAdDetailProduct[]
  ): void; // android only
  sendParticipationEvent(tag?: string): void;
  sendPreparationEvent(tag?: string): void;
  sendSignUpEvent(tag?: string): void;
  sendTutorialEvent(tag?: string): void;
  sendMissionCompleteEvent(tag?: string): void;
}

export interface KakaoAdDetailProduct {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export default requireNativeModule<ExpoKakaoAdModule>("ExpoKakaoAd");
