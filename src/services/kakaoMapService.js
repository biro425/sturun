import { API_CONFIG } from '../utils/apiConfig';

/**
 * KAKAO MAP API 서비스
 * 카카오맵 SDK를 직접 사용하여 지도를 표시
 */

class KakaoMapService {
  constructor() {
    // 카카오맵 JavaScript Key
    this.apiKey = 'api';
  }

  /**
   * 랜드마크를 그대로 반환 (좌표 변환 없이)
   * @param {Array} landmarks - 랜드마크 배열
   * @returns {Promise<Array>}
   */
  async convertLandmarksToKakaoCoordinates(landmarks) {
    // API 호출 없이 원래 좌표 그대로 반환
    return landmarks;
  }

  /**
   * 카카오맵 SDK를 사용한 HTML 생성 (공식 예제 기반)
   * @param {Array} landmarks - 랜드마크 배열
   * @returns {string} HTML 문자열
   */
  generateMapHTML(landmarks) {
    const center = landmarks.length > 0 ? landmarks[0] : API_CONFIG.DEFAULT_LOCATION;
    
    // 마커 배열 생성
    const markers = landmarks.map((landmark, index) => ({
      lat: landmark.latitude,
      lng: landmark.longitude,
      name: landmark.name,
      category: landmark.category,
      index: index + 1
    }));

    const markersJSON = JSON.stringify(markers).replace(/'/g, "\\'");

    return `<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8"/>
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Kakao 지도</title>
	<style>
		body { margin: 0; padding: 0; width: 100%; height: 100vh; overflow: hidden; background: #f0f0f0; }
		#map { width: 100%; height: 100vh; }
		.custom-label {
			background-color: #1E88E5;
			color: white;
			padding: 8px 12px;
			border-radius: 20px;
			font-size: 14px;
			font-weight: bold;
			box-shadow: 0 2px 4px rgba(0,0,0,0.2);
		}
	</style>
</head>
<body>
	<div id="map" style="width:100%;height:100vh;"></div>

	<script>
		(function() {
			console.log('Kakao Map SDK 로더 시작');
			var landmarks = ${markersJSON};
			var container = document.getElementById('map');

			function initMap() {
				try {
					kakao.maps.load(function() {
						console.log('Kakao SDK 로드 성공');
						var options = {
							center: new kakao.maps.LatLng(${center.latitude}, ${center.longitude}),
							level: 3
						};
						var map = new kakao.maps.Map(container, options);
						console.log('지도 생성 완료');

						if (landmarks && landmarks.length > 0) {
							console.log('마커 개수:', landmarks.length);
							landmarks.forEach(function(landmark) {
								var position = new kakao.maps.LatLng(landmark.lat, landmark.lng);
								var marker = new kakao.maps.Marker({ position: position });
								marker.setMap(map);
								var customOverlay = new kakao.maps.CustomOverlay({
									position: position,
									content: '<div class="custom-label">' + landmark.name + '</div>',
									yAnchor: 2
								});
								customOverlay.setMap(map);
							});
							// 도보 경로(인도 기준) 폴리라인 시도: OSRM 보행자 라우팅 사용, 실패 시 직선 폴백
							(function drawWalkingRoute() {
								if (landmarks.length < 2) return;
								var segments = [];
								for (var i = 0; i < landmarks.length - 1; i++) {
									segments.push([landmarks[i], landmarks[i + 1]]);
								}

								function fetchSegment(from, to) {
									var url = 'https://router.project-osrm.org/route/v1/foot/'
										+ from.lng + ',' + from.lat + ';' + to.lng + ',' + to.lat
										+ '?overview=full&geometries=geojson';
									return fetch(url)
										.then(function(res){ return res.json(); })
										.then(function(json){
											if (!json || !json.routes || !json.routes.length) throw new Error('No route');
											return json.routes[0].geometry.coordinates; // [lng, lat][]
										});
								}

								Promise.all(segments.map(function(pair){
									return fetchSegment(pair[0], pair[1]);
								})).then(function(results){
									// 좌표 평탄화 후 kakao LatLng 배열로 변환
									var coords = [];
									results.forEach(function(seg){
										seg.forEach(function(c){ coords.push(new kakao.maps.LatLng(c[1], c[0])); });
									});
									var polyline = new kakao.maps.Polyline({
										path: coords,
										strokeWeight: 5,
										strokeColor: '#1E88E5',
										strokeOpacity: 0.95,
										strokeStyle: 'solid'
									});
									polyline.setMap(map);
								}).catch(function(err){
									console.warn('도보 경로 조회 실패, 직선 폴백 사용', err);
									var path = landmarks.map(function(l) { return new kakao.maps.LatLng(l.lat, l.lng); });
									var polyline = new kakao.maps.Polyline({
										path: path,
										strokeWeight: 5,
										strokeColor: '#1E88E5',
										strokeOpacity: 0.9,
										strokeStyle: 'solid'
									});
									polyline.setMap(map);
								});
							})();
							var bounds = new kakao.maps.LatLngBounds();
							landmarks.forEach(function(landmark) {
								bounds.extend(new kakao.maps.LatLng(landmark.lat, landmark.lng));
							});
							map.setBounds(bounds);
							console.log('마커 및 범위 설정 완료');
						}
					});
				} catch (e) {
					console.error('지도 초기화 중 오류:', e);
					container.innerHTML = '<div style="padding: 20px; text-align: center;">지도를 불러올 수 없습니다</div>';
				}
			}

			function loadKakaoScriptAndInit() {
				var existing = document.getElementById('kakao-sdk');
				if (existing) {
					console.log('기존 Kakao SDK 스크립트 발견');
					if (window.kakao && kakao.maps && typeof kakao.maps.load === 'function') {
						return initMap();
					}
					existing.parentNode.removeChild(existing);
				}
				var script = document.createElement('script');
				script.id = 'kakao-sdk';
				script.type = 'text/javascript';
				script.src = 'https://dapi.kakao.com/v2/maps/sdk.js?appkey=${this.apiKey}&autoload=false';
				script.async = true;
				script.defer = true;
				script.onload = function() {
					console.log('Kakao SDK 스크립트 로드 완료');
					if (window.kakao && kakao.maps && typeof kakao.maps.load === 'function') {
						initMap();
					} else {
						console.error('Kakao 객체는 있으나 maps.load 없음');
						container.innerHTML = '<div style="padding: 20px; text-align: center;">지도를 불러올 수 없습니다</div>';
					}
				};
				script.onerror = function(err) {
					console.error('Kakao SDK 스크립트 로드 실패', err);
					container.innerHTML = '<div style="padding: 20px; text-align: center;">지도를 불러올 수 없습니다</div>';
				};
				document.head.appendChild(script);
			}

			if (document.readyState === 'complete' || document.readyState === 'interactive') {
				loadKakaoScriptAndInit();
			} else {
				window.addEventListener('DOMContentLoaded', loadKakaoScriptAndInit);
			}
		})();
	</script>
</body>
</html>`;
  }
}

export const kakaoMapService = new KakaoMapService();
