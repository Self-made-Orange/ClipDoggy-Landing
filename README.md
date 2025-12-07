# ClipDoggy Landing Page

Mac과 Android 간 블루투스 기반 실시간 클립보드 동기화 앱, **ClipDoggy**의 공식 랜딩 페이지입니다.

## 프로젝트 소개

ClipDoggy는 메신저 없이도 Mac과 Android 기기 간에 클립보드를 실시간으로 공유할 수 있는 앱입니다. 서버를 거치지 않는 로컬 블루투스 통신 방식으로 보안과 프라이버시를 보장합니다.

### 주요 특징
- 블루투스 기반 로컬 통신 (서버 불필요)
- 실시간 클립보드 동기화
- 히스토리 기능으로 복사 이력 관리
- 앱을 열지 않아도 탭 한 번으로 전송

## 프로젝트 구조

```
ClipDoggy-Landing/
├── web/
│   ├── index.html              # 메인 랜딩 페이지
│   ├── download/
│   │   └── index.html          # 다운로드 페이지
│   ├── resource/               # 이미지 리소스
│   │   ├── hero_section.png
│   │   ├── feature-showcase__*.png
│   │   ├── cta_section.png
│   │   └── favicon.png
│   ├── logo.svg                # 로고 (SVG)
│   ├── app_icon.png            # 앱 아이콘
│   ├── demo.png                # 데모 이미지
│   ├── version.json            # 버전 정보
│   └── CNAME                   # 도메인 설정
└── README.md
```

## 기술 스택

- **HTML5** - 시맨틱 마크업
- **CSS3** - CSS 변수, Flexbox, Grid, 반응형 디자인
- **Vanilla JavaScript** - 스크롤 애니메이션, 네비게이션 효과
- **GitHub Pages** - 정적 사이트 호스팅

## 반응형 브레이크포인트

| 브레이크포인트 | 대상 디바이스 |
|---------------|--------------|
| 1920px 이하    | 대형 데스크탑 |
| 1280px 이하    | 데스크탑      |
| 768px 이하     | 태블릿        |
| 480px 이하     | 모바일        |
| 320px 이하     | 소형 모바일   |

## 로컬 개발

정적 HTML 사이트이므로 별도의 빌드 과정이 필요 없습니다.

```bash
# 저장소 클론
git clone https://github.com/Keep-young-wild-free/ClipDoggy-Landing.git

# 로컬 서버 실행 (Python 3)
cd ClipDoggy-Landing/web
python -m http.server 8000

# 브라우저에서 확인
open http://localhost:8000
```

## 배포

GitHub Pages를 통해 자동 배포됩니다.
- **도메인**: [clipdoggy.com](https://clipdoggy.com)
- **다운로드 페이지**: [clipdoggy.com/download](https://clipdoggy.com/download)

## 지원 플랫폼

| 플랫폼 | 최소 요구사항 | 다운로드 |
|--------|-------------|----------|
| macOS  | 12.0 (Monterey) 이상 | [GitHub Releases](https://github.com/Keep-young-wild-free/ClipDoggy/releases/latest/download/ClipDoggy.dmg) |
| Android | 8.0 (Oreo) 이상 | [Google Play Store](https://play.google.com/store/apps/details?id=com.urecipe.clipdoggy) |

## API 연동 가이드

### 버전 체커 (version.json)

앱에서 최신 버전을 확인하려면 `version.json` API를 사용하세요.

**엔드포인트**: `https://clipdoggy.com/version.json`

**응답 형식**:
```json
{
  "latest": "1.0.0",
  "downloadUrl": "https://clipdoggy.com/download"
}
```

**Swift 예시**:
```swift
struct VersionInfo: Codable {
    let latest: String
    let downloadUrl: String
}

func checkForUpdate() async throws -> VersionInfo {
    let url = URL(string: "https://clipdoggy.com/version.json")!
    let (data, _) = try await URLSession.shared.data(from: url)
    return try JSONDecoder().decode(VersionInfo.self, from: data)
}

// 사용 예시
let versionInfo = try await checkForUpdate()
let currentVersion = Bundle.main.infoDictionary?["CFBundleShortVersionString"] as? String ?? "0.0.0"

if versionInfo.latest > currentVersion {
    // 업데이트 알림 표시
    print("새 버전 \(versionInfo.latest) 사용 가능!")
}
```

### DMG 다운로드 버튼

앱 내에서 직접 DMG 다운로드 링크를 제공하려면 아래 URL을 사용하세요.

**다운로드 URL**:
```
https://github.com/Keep-young-wild-free/ClipDoggy/releases/latest/download/ClipDoggy.dmg
```

**SwiftUI 버튼 예시**:
```swift
import SwiftUI

struct UpdateButton: View {
    let downloadURL = URL(string: "https://github.com/Keep-young-wild-free/ClipDoggy/releases/latest/download/ClipDoggy.dmg")!

    var body: some View {
        Button(action: {
            NSWorkspace.shared.open(downloadURL)
        }) {
            HStack {
                Image(systemName: "arrow.down.circle.fill")
                Text("최신 버전 다운로드")
            }
            .padding()
            .background(Color.blue)
            .foregroundColor(.white)
            .cornerRadius(8)
        }
        .buttonStyle(.plain)
    }
}
```

**AppKit 버튼 예시**:
```swift
import AppKit

class UpdateManager {
    static let downloadURL = URL(string: "https://github.com/Keep-young-wild-free/ClipDoggy/releases/latest/download/ClipDoggy.dmg")!

    static func downloadUpdate() {
        NSWorkspace.shared.open(downloadURL)
    }
}

// 버튼 액션에서 호출
@IBAction func downloadButtonClicked(_ sender: Any) {
    UpdateManager.downloadUpdate()
}
```

## 관련 링크

- [ClipDoggy 공식 사이트](https://clipdoggy.com)
- [개인정보처리방침](https://urecipe.notion.site/ClipDoggy-1588c0bea16780dabe87f61ebcc4aaca)
- [서비스 이용약관](https://urecipe.notion.site/ClipDoggy-1588c0bea1678091bf05f6f04c0fc80d)

## 문의

- **이메일**: clipdoggy@gmail.com

## 라이선스

© 2025 ClipDoggy. All rights reserved.
