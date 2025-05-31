import ExpoModulesCore
import UIKit
import KakaoAdSDK
import AdSupport
import AppTrackingTransparency

struct KakaoAdDetailProduct: Record {
  @Field
  var id: String = ""
  
  @Field
  var name: String = ""
  
  @Field
  var quantity: Int = 0
  
  @Field
  var price: Double = 0.0
}

public class ExpoKakaoAdModule: Module {
    public func definition() -> ModuleDefinition {
        Name("ExpoKakaoAd")

        /*
         * 광고계정별로 고유한 식별값. trackId 를 설정하지 않을 경우 이벤트 수집은 이루어지지 않습니다.
         */
        OnCreate {
            if let trackId = Bundle.main.object(forInfoDictionaryKey: "KAKAO_AD_TRACK_ID") as? String {
                KakaoAdTracker.trackId = trackId
            }
        }

        /*
         * 이벤트 트래커 활성화
         */
        AsyncFunction("activate") { (promise: Promise) in
            if #available(iOS 14, *) {
                ATTrackingManager.requestTrackingAuthorization { status in
                    switch status {
                    case .authorized:
                        // 추적 권한 요청 팝업이 뜨고, 사용자가 허용함.
                        print("Authorized")
                        // 광고식별자 확인 가능
                        print(ASIdentifierManager.shared().advertisingIdentifier)
                    case .denied:
                        // 사용자가 거부함.
                        print("Denied")
                    case .notDetermined:
                        // 팝업이 뜨지 않음.
                        print("Not Determined")
                    case .restricted:
                        print("Restricted")
                    @unknown default:
                        print("Unknown")
                    }
                    // 권한 요청 완료 후 트래커 활성화
                    KakaoAdTracker.activate()
                    promise.resolve()
                }
            } else {
                // iOS 14 미만에서는 바로 활성화
                KakaoAdTracker.activate()
                promise.resolve()
            }
        }

        /*
         * 회원가입 이벤트
         * @param tag: tag의 경우, 한 광고계정 내에서 같은 이벤트코드 내에서도 특별한 분류가 필요할 때 추가합니다.
         */
        Function("sendCompleteRegistrationEvent") { (tag: String?) in
            KakaoAdTracker.sendCompleteRegisterEvent(tag: tag)
        }

        /*
         * 로그인 이벤트
         * @param tag: tag의 경우, 한 광고계정 내에서 같은 이벤트코드 내에서도 특별한 분류가 필요할 때 추가합니다.
         */
        Function("sendLoginEvent") { (tag: String?) in
            KakaoAdTracker.sendLoginEvent(tag: tag)
        }

        /*
         * Search Event
         * @param tag: tag의 경우, 한 광고계정 내에서 같은 이벤트코드 내에서도 특별한 분류가 필요할 때 추가합니다.
         * @param searchString: 검색어
         */
        Function("sendSearchEvent") { (tag: String?, searchString: String?) in
            KakaoAdTracker.sendSearchEvent(tag: tag, searchString: searchString)
        }

        /*
         * 콘텐츠/상품 조회 이벤트
         * @param tag: tag의 경우, 한 광고계정 내에서 같은 이벤트코드 내에서도 특별한 분류가 필요할 때 추가합니다.
         * @param contentId: 콘텐츠/상품 코드
         */
        Function("sendViewContentEvent") { (tag: String?, contentId: String?) in
            KakaoAdTracker.sendViewContentEvent(tag: tag, contentId: contentId)
        }

        /*
         * 관심상품 추가 이벤트
         * @param tag: tag의 경우, 한 광고계정 내에서 같은 이벤트코드 내에서도 특별한 분류가 필요할 때 추가합니다.
         * @param contentId: 콘텐츠/상품 코드
         */
        Function("sendAddToWishListEvent") { (tag: String?, contentId: String?) in
            KakaoAdTracker.sendAddToWishListEvent(tag: tag, contentId: contentId)
        }

        /*
         * 장바구니 추가 이벤트
         * @param tag: tag의 경우, 한 광고계정 내에서 같은 이벤트코드 내에서도 특별한 분류가 필요할 때 추가합니다.
         * @param contentId: 콘텐츠/상품 코드
         */
        Function("sendAddToCartEvent") { (tag: String?, contentId: String?) in
            KakaoAdTracker.sendAddToCartEvent(tag: tag, contentId: contentId)
        }

        /*
         * 장바구니 보기 이벤트
         * @param tag: tag의 경우, 한 광고계정 내에서 같은 이벤트코드 내에서도 특별한 분류가 필요할 때 추가합니다.
         */
        Function("sendViewCartEvent") { (tag: String?) in
            KakaoAdTracker.sendViewCartEvent(tag: tag)
        }
        
        /*
         * 구매 이벤트
         * @param tag: tag의 경우, 한 광고계정 내에서 같은 이벤트코드 내에서도 특별한 분류가 필요할 때 추가합니다.
         * @param totalQuantity: 주문에 포함된 상품수
         * @param totalPrice: 주문 전체 금액
         * @param currency: 결제 금액 통화 (ISO4217 포맷)
         * @param products: KakaoAdDetailProduct 클래스 객체의 Array 타입을 입력 받습니다. 개별 주문 상품 상세 정보의 리스트 입니다.
         */
        Function("sendPurchaseEvent") { (tag: String?, totalQuantity: Int, totalPrice: Double, currency: String?, products: [KakaoAdDetailProduct]) in
            let kakaoProducts = products.map { product in
                KakaoAdSDK.KakaoAdDetailProduct(
                    id: product.id,
                    name: product.name,
                    quantity: product.quantity,
                    price: product.price
                )
            }
            
            KakaoAdTracker.sendPurchaseEvent(
                tag: tag,
                totalQuantity: totalQuantity,
                totalPrice: totalPrice,
                currency: currency,
                products: kakaoProducts
            )
        }
       
        /*
         * 잠재고객 이벤트
         * @param tag: tag의 경우, 한 광고계정 내에서 같은 이벤트코드 내에서도 특별한 분류가 필요할 때 추가합니다.
         */
        Function("sendParticipationEvent") { (tag: String?) in
            KakaoAdTracker.sendParticipationEvent(tag: tag)
        }

        /*
         * 사전준비 이벤트
         * @param tag: tag의 경우, 한 광고계정 내에서 같은 이벤트코드 내에서도 특별한 분류가 필요할 때 추가합니다.
         */
        Function("sendPreparationEvent") { (tag: String?) in
            KakaoAdTracker.sendPreparationEvent(tag: tag)
        }

        /*
         * 서비스신청 이벤트
         * @param tag: tag의 경우, 한 광고계정 내에서 같은 이벤트코드 내에서도 특별한 분류가 필요할 때 추가합니다.
         */
        Function("sendSignUpEvent") { (tag: String?) in
            KakaoAdTracker.sendSignUpEvent(tag: tag)
        }
        
        /*
         * 튜토리얼 이벤트
         * @param tag: tag의 경우, 한 광고계정 내에서 같은 이벤트코드 내에서도 특별한 분류가 필요할 때 추가합니다.
         */
        Function("sendTutorialEvent") { (tag: String?) in
            KakaoAdTracker.sendTutorialEvent(tag: tag)
        }

        /*
         * 목표달성
         * @param tag: tag의 경우, 한 광고계정 내에서 같은 이벤트코드 내에서도 특별한 분류가 필요할 때 추가합니다.
         */
        Function("sendMissionCompleteEvent") { (tag: String?) in
            KakaoAdTracker.sendMissionCompleteEvent(tag: tag)
        }        
    }
}