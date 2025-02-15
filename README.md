# Carrot Market (Learn Next.js)

### 1. tailwind

- **flex justify**

  ✔ 양 끝에도 여백이 필요한 경우 justify-around

  ✔ 양 끝을 부모 컨테이너에 딱 붙이고 싶으면 justify-between

- **굳이 flex-col 쓰는 이유는?**

  ✔ 블록 요소끼리는 기본적으로 세로로 정렬되지만, flex flex-col을 사용하면 align-items, justify-content, order 등을 활용할 수 있어서 더 유연한 레이아웃을 만들 수 있음.

- **tailwind의 변수 설정 클래스**

  예를 들어, ring class의 경우엔 다양한 variable을 추가 선언 가능하다.

  ```css
  .ring {
    --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(
        --tw-ring-offset-width
      )
      var(--tw-ring-offset-color);
    --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(
        3px + var(--tw-ring-offset-width)
      )
      var(--tw-ring-color);
    box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0
          0 #0000);
  }
  ```

  ```jsx
  <div classname="ring ring-shadow ring-offset-2 ring-blue-500"></div>
  ```

- **required input를 invalid 가상 클래스를 통해 스타일 제어**

  ```jsx
  // 유효한 입력값이 아닐 때, input focus하면 ring color 붉은색으로 보임
  <input
    className="ring ring-transparent focus:ring-green-500 focus:ring-offset-2  invalid:focus:ring-red-500 peer"
    type="email"
    placeholder="Email Address"
    required
  />
  ```

- **형제 상태에 따른 스타일 지정 (peer-{modifier})**

  형제 요소의 상태에 따라 요소의 스타일을 지정해야 하는 경우 형제를 peer 클래스로 표시하고 peer-invalid와 같은 peer-\* 수정자를 사용하여 대상 요소의 스타일을 지정.

  > ⚠️ 주의!
  > peer 마커는 이전 형제에서만 사용할 수 있다는 점을 유의
  >
  > [tailwind peer](https://tailwindcss.com/docs/hover-focus-and-other-states#styling-based-on-sibling-state)

  ```jsx
  // 작동XXX. 이전 형제 자매만 peer로 표시될 수 있음.
  // input이 span보다 앞에 있어야 함
  <label>
    <span class="peer-invalid:text-red-500 ...">Email</span>
    <input type="email" class="peer ..." />
  </label>
  ```

- **\*: (자식 선택)**

  모든 자식요소에 공통 적용할 클래스

- **has-[]**:

  자식의 요소중 [:상태, .class] 인 경우에 부모에 적용할 클래스

  > ⚠️주의
  > has-[#keyOfChild]는 적용되지 않음
  > has-[input[data-key='email']] 와 같이 사용 권장

  ```jsx
    // 자식 요소중 invaild한 값을 가진 것이 있다면 div 의 ring color 붉은 색으로 변경됨
    <div className="*:outline-none ring ring-transparent transition-shadow has-[:invalid]:ring-red-200">
      <!-- children.. -->
    </div>
  ```

### 2. Server Action

- **Route Handler (API Route)**

  ✔ Route Handlers를 사용하면 웹 요청 및 응답 API를 사용하여 특정 경로에 대한 사용자 커스텀 요청 핸들러를 생성할 수 있다.

  ✔ Route Handlers는 app 디렉터리 내에서만 사용할 수 있다.

  > app/api(www)/[users]/route.ts

  ✔ 다만, `Server Action`을 사용하면 굳이 사용할 필요가 없다. 통신을 위해 JS를 사용해야하기 때문이다.

  ✔ 공식 문서

  - [Route Handler](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
  - [Route.ts](https://nextjs.org/docs/app/api-reference/file-conventions/route)

- **useServerStatus**

  ✔ 부모 form action의 진행(pending)을 알기 위해 사용

  ✔ 프로젝트에서는 submit 버튼의 연속 클릭 방지를 위해 사용

  ✔ form의 자식인 client 컴포넌트에서만 사용 가능 (form이 작성된 컴포넌트에서는 사용 불가)

  ```jsx
  const { pending } = useFormStatus();
  ```

- **useActionState**

  ✔ form action의 결과를 알기 위해 사용

  ```jsx
  // state -> form이 반환한 값, action의 실행 결과값이 된다.
  // trigger(dispatch, action) -> form의 action 실행 함수
  const [state, action] = useActionState(
    handleForm, // form 핸들러 함수
    null // state의 초기값 설정
  );
  ```

  > **useActionState의 실행 순서**
  >
  > 1. 초기값(state) handleForm으로 전송
  > 2. action 트리거 (form 제출)
  > 3. 초기값 state, action 결과값으로 갱신

### 3. Prisma

> Prisma는 Node.js와 TypeScript에서 사용되는 ORM(Object-Relational Mapping) 도구.
>
> 데이터베이스와 애플리케이션 간의 상호작용을 쉽게 해주는 강력한 도구로, SQL 쿼리를 TypeScript 코드로 대체 가능

- **사용 방법**

  ```zsh
    npm i prisma
  ```

  > prisma 설치

  ```zsh
    npx prisma init
  ```

  > schema.prisma 파일 생성

- **prisma model**

  ```prisma
    // model -> db에 든 객체
    // model schema 정의
    model User {
      // @default(autoincrement()) -> 사용자 id 자동으로 증가시키기
      // 최초 사용자 id = 1
      id         Int       @id @default(autoincrement())
      username   String    @unique
      // 전화번호, 소셜 로그인 한 유저의 경우에는 email, pw가 정의되지 않을 수 있으므로 ? 사용
      email      String?   @unique
      password   String?
      phone      String?   @unique
      github_id  String?   @unique
      avatar     String?
      // now() -> 사용자가 생성되는 시간 반환 함수
      created_at DateTime? @default(now())
      // 사용자 레코드가 수정된 시간을 속성에 넣기
      updated_at DateTime? @updatedAt
    }
  ```

- **migration**

  ```zsh
  npx prisma migrate dev
  ```

  > -> 생성된 마이그레이션 파일을 데이터베이스에 적용 (migration.sql 파일에 작성한 model에 관한 sql문 생성)
  >
  > -> npx prisma create 명령어도 함께 실행. 이 명령어로 Client 생성
  >
  > Generated Prisma Client (v6.3.1) to ./node_modules/@prisma/client

- **Prisma Studio**

  ```zsh
    npx prisma studio
  ```

  > localhost:5555로 열림. 데이터베이스 시각화

- **@relation**

  > 관계된 두 모델 연결시키기

  ```prisma
    model User{
      // ...다른 필드값
      SMSToken   SMSToken[]
    }

    model SMSToken {
      id         Int       @id @default(autoincrement())
      token      String    @unique
      created_at DateTime? @default(now())
      updated_at DateTime? @updatedAt
      // 아래 줄을 기입하는 이유는
      // prisma에게 userId가 가지는 의미(사용자 아이디) userId를 어디서 찾아야하는지 이런걸 명시적으로 알려주기 위해서
      // SMSToken의 userId 필드는 User model의 id 필드를 참조한다는 의미
      user       User      @relation(fields: [userId], references: [id])
      userId     Int
      // 실제로 저장되는 값은 userId
      // userId를 바탕으로 User정보를 찾는것
    }
  ```

  ```ts
  async function test() {
    const token = await db.sMSToken.findUnique({
      where: {
        id: 1,
      },
      // smsToken와 관계된(relation) user data 불러오기
      include: {
        user: true,
      },
    });
    console.log(token);
  }
  ```

- **onDelete**

  > Referential actions는 관련된 레코드가 삭제되거나 업데이트될 때 어떤 일이 발생하는지를 결정.

  > Prisma는 아래의 referential actions 종류를 지원함

  - Cascade: 참조 레코드를 삭제하면 참조 레코드의 삭제가 트리거.
  - Restrict: 참조 레코드가 있는 경우 삭제를 방지.
  - NoAction: Restrict과 유사하지만 사용 중인 데이터베이스에 따라 다름.
  - SetNull: 참조 필드가 NULL로 설정. (optional일 때만 정상 작동)
  - SetDefault: 참조 필드가 기본값으로 설정.

### 4. Authentication

- **iron-session**

  > iron-session은 안전하고, statelss한, 쿠키 기반 JavaScript용 세션 라이브러리.

  ```zsh
  npm i iron-session
  ```

- **Cookie vs Session**

  - Cookie - Web Browser (Client에서 사용)
  - Session - Server에서 사용
  - 단 쿠키안에 세션 ID가 있고 서버에 세션ID 안에 세션 존재.
  - 작동 방식
    > 1. 브라우저가 서버 접속
    >
    > 2. 서버에서 쿠키안에 세션ID를 브라우저에 전달
    >
    > 3. 브라우저가 쿠키안에 세션ID와 페이지 데이터를 서버에 전달
    >
    > 4. 서버에서 세션ID를 검색하고 페이지에 맞는 데이터 전달.

- **zod superRefine**

  > fatal한 에러 발생시 뒤의 validation을 실행하지 않고 얼리리턴

  ```tsx
    .superRefine(async ({ username }, ctx) => {
      const user = await db.user.findUnique({
        where: { username },
        select: { id: true },
      });
      if (user) {
        ctx.addIssue({
          code: "custom",
          message: "이미 사용중인 이름입니다.",
          path: ["username"],
          fatal: true,
        });

        return z.NEVER;
      }
    })
  ```

- **Iron-Session vs session DB**
  | **기준** | **IronSession (HttpOnly 쿠키)** | **Session DB (Redis, SQL)** |
  |--------------------------|----------------------------------------------|--------------------------------------------|
  | **설정 및 구현** | 간단하고 설정이 쉬움 | 복잡한 설정 필요 (DB 구축) |
  | **데이터 크기 제한** | 약 4KB 제한 | 제한 없음 |
  | **보안** | 암호화된 쿠키, HTTPS 필요, 쿠키 하이재킹에 취약 | 서버 관리, 세션 만료 관리 용이, 데이터베이스 보안 설정 필요 |
  | **응답 속도** | 빠름 (Stateless) | 다소 느릴 수 있음 (DB 액세스 필요) |
  | **서버 확장성** | 서버 확장에 유리 | 서버 확장 시 관리 복잡성 증가 |
  | **장기 세션 관리** | 부적합 (단기 세션에 적합) | 적합 (장기 상태 유지 가능) |
  | **복잡한 사용자 상태 관리** | 어려움 | 용이 |

### 5. Middleware

- **Middleware**

  - 사용자 페이지 이동 전 `어떠한 코드` 실행 가능
    - GET /profile ---> middleware() ---> `<Profile />`
  - 웹사이트의 모든 req마다 middleware가 실행된다.

    - 즉 웹사이트의 모든 req를 인터셉트할 수 있음.

  - 예시)

    ```tsx
    export async function middleware(req: NextRequest) {
      if (req.nextUrl.pathname === "/not-allowed") {
        /** fetch api 로 새로운 JSON 응답 보내기 */
        return Response.redirect({
          error: "you are not allowed here",
        });
      }
      if (req.nextUrl.pathname === "/profile") {
        // 쿠키 받아오기
        const session = await getSession();

        /** js constructor URL을 사용하여 redirect 시키기 */
        return Response.redirect(new URL("/", req.url));
      }
    }
    ```

- **Middleware config matcher**

  > matcher를 사용하면 matcher에 지정한 특정 경로들에서만 미들웨어가 실행되도록 할 수 있음.
  >
  > [공식문서](https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher)

  ```tsx
  // 배열 구문을 사용하여 단일 경로 또는 다중 경로를 일치시킬 수 있음.
  export const config = {
    matcher: ["/profile", "/about/:path*", "/dashboard/:path*"],
  };
  ```

  - mathcer는 전체 정규식 표현식(regex)을 허용 (부정 예측 또는 문자 일치 등)

  ```tsx
  export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
  };
  ```

- **Edge Runtime**

  > 미들웨어는 현재 Edge 런타임과 호환되는 API만 지원
  >
  > Node.js 전용 API는 지원 XXX
  >
  > [Runtime](https://nextjs.org/docs/app/building-your-application/rendering/edge-and-nodejs-runtimes)
  >
  > [Edge Runtime](https://nextjs.org/docs/app/api-reference/edge)

### 6. Social Login (Github Authentication)

- github application 생성

  - [app 생성 바로가기](https://github.com/settings/applications/new)
  - [권한 부여](https://docs.github.com/ko/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps)
  - [스코프](https://docs.github.com/ko/apps/oauth-apps/building-oauth-apps/scopes-for-oauth-apps)

  > 1. 사용자 프로필 클릭
  >
  > 2. 사이드메뉴 맨 아래 '<> Developer settings' 메뉴 클릭
  >
  > 3. OAuth Apps 메뉴 클릭
  >
  > 4. 중앙 컨텐츠 우측 상단 'New OAuth App'
  >
  > 5. secret 키, 인증 콜백 설정

- **Access Token**

  > [Access Token(GitHub가 사용자를 사이트로 다시 리디렉션)](https://docs.github.com/ko/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps#2-users-are-redirected-back-to-your-site-by-github)

  - 잘못된 인증 코드 오류

    - 전달한 인증 코드가 올바르지 않거나 만료되었거나
      첫 번째 권한 부여 요청에서 받은 코드와 일치하지 않으면 이 오류가 발생.
      이 오류를 해결하려면 OAuth 권한 부여 프로세스를 다시 시작하고 새 코드를 가져와야함.

    - [인증 코드 에러](https://docs.github.com/ko/apps/oauth-apps/maintaining-oauth-apps/troubleshooting-oauth-app-access-token-request-errors#bad-verification-code)

    ```json
    {
      "error": "bad_verification_code",
      "error_description": "The code passed is incorrect or expired.",
      "error_uri": "/apps/managing-oauth-apps/troubleshooting-oauth-app-access-token-request-errors/#bad-verification-code"
    }
    ```

- **액세스 토큰을 사용하여 API에 액세스**

  > [github api](https://docs.github.com/ko/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps#3-use-the-access-token-to-access-the-api)

  ```bash
    Authorization: `Bearer ${AccessToken}`
    GET https://api.github.com/user
  ```

### 7. Products

- **Layout.tsx의 특이점**

  > (group A) 안에 Layout.tsx를 정의하면 해당 그룹에서만 사용가능한 레이아웃이 된다.
  >
  > 이를 이용하여 특정 페이지에서만 사용하는 네비게이션 등을 제작 가능함.

- **Intl.RelativeTimeFormat**

  > Intl.RelativeTimeFormat은 JavaScript의 국제화(Intl) API 중 하나로, 날짜나 시간을 현재 시점과의 상대적인 시간 표현으로 포맷해주는 기능을 제공함.
  >
  > 이를 통해 “3일 전”, “2시간 후”와 같은 상대적 시간 표현을 간편하게 구현할 수 있음.

  ```jsx
  /** 날짜를 x일 전, x일 후로 표기하는 함수 */
  export function formatToTimeAgo(date: string): string {
    const dayInMs = 1000 * 60 * 60 * 24;
    const time = new Date(date).getTime();
    const now = new Date().getTime();
    const diff = Math.round((time - now) / dayInMs);

    const formatter = new Intl.RelativeTimeFormat("ko");

    return formatter.format(diff, "days");
  }
  ```

- **Dynamic Route**

  > app/[id]/page.tsx -> app/123으로 이동하면 해당 route의 params id를 알 수 있다

  ```jsx
  interface ProductDetailPageProps {
    params: Promise<{ id: string }>;
  }

  export default async function ProductDetail({
    params,
  }: ProductDetailPageProps) {
    const { id } = await params;

    return <span>product detail {id}</span>;
  }
  ```

- **Image HostName**

  > Image 태그를 통해 외부 이미지 최적화를 진행 위해선 hostname 등록이 필요함

  ```ts
  const nextConfig: NextConfig = {
    /* config options here */
    images: {
      remotePatterns: [{ hostname: "image.link.com" }],
    },
  };
  ```

- **즉시 실행 함수로 목업 데이터 심기**

  - 즉시 실행 함수(IIFE)

    ```js
    (async () => {
      console.log("Hello");
    })();
    ```

  - /prisma/seed.js

    ```js
    (async () => {
      for (let i = 0; i < 100; i++) {
        const randomPrice =
          Math.floor(Math.random() * (99999 - 1000 + 1)) + 1000;

        await db.product.create({
          data: {
            price: randomPrice,
            description: `자동으로 생성된 세구세구 ${i + 1}번째`,
            photo: "/gosegu.png",
            title: `세구 ${i + 1}`,
            userId: 19,
          },
        });
      }

      console.log("목업 데이터 삽입 완료!");
      await db.$disconnect();
    })();
    ```

  - package.json

    ```json
      "prisma": {
        "seed": "node prisma/seed.js"
      },
    ```

  - run

    ```bash
      npx prisma db seed
    ```

- **URL.createObjectURL()**

  > URL.createObjectURL()은 파일이나 데이터(blob)를 브라우저에서 임시 URL로 만들어 주는 함수.

  > **동작 방식**
  >
  > 1. 파일을 선택하거나 데이터(blob)를 생성하면, 그 데이터를 직접 다루기 어려움
  >
  > 2. URL.createObjectURL(파일 또는 blob)을 사용하면, 그 데이터를 가리키는 가짜 URL이 생성
  >
  > 3. 이 URL은 , 같은 태그에서 사용하여 파일을 미리 보거나 다운로드할 수 있음
  >
  > 4. 브라우저를 닫거나 새로고침하면 URL이 자동으로 사라짐

### 8. CloudFlare

> **사용방법**
>
> CloudFlare DashBoard > Images > Overview(개요)
>
> 계정 ID, 계정 해시, API Token
>
> API 토큰 얻기 > Cloudflare Stream 및 Images 읽기 및 쓰기

- **일회성 upload url**

  ```ts
  // actions.ts
  export async function getUploadUrl() {
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/images/v2/direct_upload`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.CLOUDFLARE_API_KEY}`,
        },
      }
    );

    const data = await response.json();

    return data;
  }
  ```

- **이미지 업로드**

  ```tsx
  // interceptAction function

  // 폼에서 가져온 사진 파일
  const file = formData.get("photo");

  const cloudflareForm = new FormData();
  cloudflareForm.append("file", file);

  const response = await fetch(uploadUrl, {
    method: "post",
    body: cloudflareForm,
  });
  ```

- **varient**
  - imageUrl/<varient name> 이 upload한 이미지의 url
  - 이미지 변형 탭을 통해 원하는 크기의 이미지 생성 가능
  - `유연한 변형`을 통해 이미지 url에 쿼리를 넣어 변수 없이도 이미지 변형 가능
    - [공식문서](https://developers.cloudflare.com/images/manage-images/enable-flexible-variants/)

### 9. Form Action Intercept

- Action을 인터셉트해서 원하는 형태로 개조 후에 다시 정상적 동작 시키기

```tsx
const interceptAction = async (_: any, formData: FormData) => {
  // upload image
  const file = formData.get("photo");

  if (!file) {
    alert("이미지를 확인하지 못했습니다.");
    return;
  }

  const cloudflareForm = new FormData();
  cloudflareForm.append("file", file);

  const response = await fetch(uploadUrl, {
    method: "post",
    body: cloudflareForm,
  });

  if (response.status !== 200) {
    alert("이미지 업로드에 실패했습니다.");
    return;
  }

  // replace photo in formdata
  const photoUrl = `https://imagedelivery.net/MR01-6_39Z4fkK0Q1BsXww/${imageId}`;
  formData.set("photo", photoUrl);

  // call uploadProduct Action (정상적인 Action)
  // await이 아닌 return 사용하기
  return uploadProduct(_, formData);
};

// intercept Action으로 대체
const [state, action] = useActionState(interceptAction, null);
```

### 10. Modal

- **Intercepting Routes**

  > Intercepting Routes는 특정 경로의 콘텐츠를 현재의 레이아웃 안에서 불러오는 기능을 의미임.
  >
  > 보통 사용자가 특정 링크를 클릭하면 완전히 새로운 페이지로 이동하지만, Intercepting Routes를 사용하면 실제로는 다른 경로의 콘텐츠를 현재 페이지 내에서 표시할 수 있음.
  >
  > 이렇게 하면 사용자는 기존 컨텍스트를 유지한 채로 새로운 정보를 볼 수 있게 됨.
  >
  > [공식문서](https://nextjs.org/docs/app/building-your-application/routing/intercepting-routes)

  - Intercepting Routes는 (..) 규칙으로 정의할 수 있음. 이는 상대 경로 규칙인 ../와 유사하다. (세그먼트: app 폴더 안의 각 폴더가 하나의 세그먼트)

    - (.): 같은 레벨의 세그먼트와 일치시키기
    - (..): 한 레벨 위의 세그먼트와 일치시키기
    - (..)(..): 두 레벨 위의 세그먼트와 일치시키기
    - (...): 루트 앱 디렉토리의 세그먼트와 일치시키기
    - [공식문서](https://nextjs.org/docs/app/building-your-application/routing/intercepting-routes#convention)

- **Parallel Routes**

  > Parallel Routes는 동시에 여러 페이지를 렌더링하거나 특정 조건에 따라 다르게 렌더링할 수 있도록 하는 기능
  >
  > 병렬 라우트는 슬롯(Slots) 을 사용하여 구현됨
  >
  > 슬롯은 @폴더명 형식으로 정의되며, 특정 영역에서 다른 페이지를 동시에 렌더링할 수 있도록 한다.
  >
  > https://nextjs.org/docs/app/building-your-application/routing/parallel-routes
