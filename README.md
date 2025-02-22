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

- **url을 변경시키며 모달을 보여주는 방법**

  1. Link 태그를 사용하여 `특정 루트` 로 이동을 지시하도록 한다.

     > <Link href="/any-route"></Link>

  2. `특정 루트` 에 대한 Intercepting Route를 같은 세그먼트에서 작성한다

     > /(특정 루트에 맞는 syntax)/any-route/page.tsx

  3. Parallel Route를 사용하여 작성한 Intercepting Route를 `@pararllelName` 에 집어넣는다

     > /@pararllelName/(특정 루트에 맞는 syntax)/any-route/page.tsx

  4. 인터셉트 전에 404 에러를 처리하기 위해 default를 작성한다

     > /@pararllelName/default.tsx

  5. 해당 세그먼트에 대한 layout.tsx를 작성한다
     ```tsx
     export default function HomeLayout({
       children,
       pararllelName,
     }: {
       children: React.ReactNode;
       pararllelName: React.ReactNode;
     }) {
       return (
         <>
           {children}
           {pararllelName}
         </>
       );
     }
     ```

### 11. Cache

- **unstable_cache**

  > Next팀이 14버전에서 공개한 캐싱함수 아직은 불안정할 수있으므로, 이름이 저모양이다. 추후 이름이 바뀔수도있음
  >
  > [공식문서(한글판)](https://nextjs-ko.org/docs/app/api-reference/functions/unstable_cache)

  - **사용방법**

    > 첫 번째 매개변수: action 함수 삽입 (db 통신, 데이터를 반환하는 함수)
    >
    > 두번째 매개변수: 캐시키 배열 (프로젝트 내부에서 하나의 action에대해 unique해야함. 다른 action함수에 같은값을 사용하면 안됨)
    >
    > 이렇게 세팅한 unstable_cache를 기존의 action대신 호출해주면 됨.

  - **revalidate time**

    > revalidate는 Next.js에서 데이터 캐싱을 얼마나 자주 갱신할지 설정하는 옵션. 즉, 정적인 데이터를 일정 시간이 지나면 자동으로 갱신하도록 설정할 수 있다
    >
    > 특정 사용자(클라이언트)를 추적하는 것이 아니라, 서버에서 캐시된 데이터의 만료 주기를 설정하는 역할

    ```tsx
    const getCachedProducts = nextCache(getInitialProducts, ["home-products"], {
      // 60초가 지난후 새로운 요청이 있다면 캐시 데이터 갱신
      revalidate: 60,
    });
    ```

  - **revalidatePath**

  > 지정한 경로에 캐시된 `모든` 데이터를 무효화(재검증)

  ```tsx
  // 버튼 클릭하면 캐시된 데이터가 리프레시됨
  const revalidate = async () => {
    "use server";
    revalidatePath("/home");
  };

  return (
    <form action={revalidate}>
      <button>revalidate</button>
    </form>
  );
  ```

  - **revalidateTag**

  > revalidateTag는 특정 캐시 태그에 대해 저장된 데이터를 즉시 무효화 기능 제공
  >
  > 서버에서만 정상 동작함.

  ```tsx
  const getCachedProductTitle = nextCache(getProductTitle, ["product-title"], {
    tags: ["#product-title", "#product"],
  });

  const revalidate = async () => {
    "use server";
    revalidatePath("#product");
  };

  return (
    <form action={revalidate}>
      <button>revalidate</button>
    </form>
  );
  ```

- **fetch cache**

> Next.js 15 버전부터는 fetch 요청은 기본적으로 더 이상 캐시되지 않는다. 특정 fetch 요청을 캐시에 포함시키려면 cache: 'force-cache' 옵션을 사용해야 함.
>
> unstable-cache와 마찬가지로 revalidate, tags를 사용할 수 있다. -> 캐시 갱신도 마찬가지로 revalidatePath, revalidateTag 쓰면 된다.

- **캐싱이 안되는 요청들**

  1. post request
  2. cookies, headers 사용
  3. server action에 있는 fetch request

- **예시**

  ```tsx
  export default async function RootLayout() {
    const a = await fetch("https://..."); // 캐시되지 않음
    const b = await fetch("https://...", { cache: "force-cache" }); // 캐시됨
    // 캐시됨, revalidate, tags 설정
    const c = await fetch("https://...", {
      cache: "force-cache",
      next: {
        revalidate: 60,
        tags: ["hello"],
      },
    });
  }
  ```

- **Static, Dynamic 페이지**

  > ○ (Static) → 정적인 페이지로 미리 렌더링되어 배포됨 (빌드 시 HTML 생성)
  >
  > ƒ (Dynamic) → 동적인 페이지로 요청 시 서버에서 렌더링됨 (요청 시 서버에서 렌더링됨)
  >
  > 모든 사용자에게 동일한 내용이 제공되는 페이지면: Static (빌드 타임에서 캐싱)
  >
  > 사용자에 따라 다른 내용이 제공될 수 있는 페이지면: Dynamic

- **unstable-cache를 사용하는 이유**

  > Production Mode에서 static page는 빌드 타임에 정적인 html로 변환된다. 즉, Static Page는 빌드 타임에 캐싱된 데이터를 사용한다.
  >
  > 또한 fetch 요청은 "force-cache"를 통해 캐시가 가능하다.
  >
  > Q. 그럼 unstable-cache를 이용해야할 필요가 있는가?
  >
  > A. 서버 내부에서 fetch가 아닌 DB 쿼리, 계산 로직 등을 캐싱해야 하는 경우에 필요하다.

- **Route Segment Config**

> Next.js에서 페이지(Page), 레이아웃(Layout), 라우트 핸들러(Route Handler) 의 동작을 설정할 수 있는 기능
>
> 즉, 특정 페이지나 라우트에서 “이건 이렇게 동작해야 해!” 라고 설정할 수 있는 옵션
>
> [공식문서](https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config)

```tsx
export const dynamic = "force-dynamic"; // 이 페이지를 "완전히 동적 페이지"로 설정
export const revalidate = 60; // 60초마다 새로운 데이터를 가져오도록 설정

// force-dynamic은 unstable-cache와 함께 사용하면 좋을 것 같다. 페이지를 동적으로 가져오되, 데이터를 캐싱하여 db 부하를 줄이는 방법으로 개발하기
```

- 추가 내용 (dynamicIO)
  Next.js에서는 새로운 기능인 dynamicIO 플래그가 등장하면서 Route Segment Config는 앞으로 지원이 중단될 예정(Deprecated)

[공식문서](https://nextjs.org/docs/app/api-reference/config/next-config-js/dynamicIO)

- **generateStaticParams**

> `/products/[id]` 와 같이 params를 사용하는 dynamic 페이지의 일부를 static하게 변경한다. 빌드 타임에서 미리 params를 받아 static page로 생성하기 때문에 가능한 일.
>
> ● (SSG) prerendered as static HTML (uses generateStaticParams)

```jsx
export async function generateStaticParams() {
  const products = await db.product.findMany({ select: { id: true } });
  return products.map((product) => ({
    id: product.id + "",
  }));
}
```

- SSG로 생성된 상품 static page를 revalidate하려면 (ISR) `revalidatePath("/products/[변경할 상품 Id]")` 하면 된다.

- Q. production mode에서 아예 새로운 상품이 추가되었을때는 static page 생성이 가능할까? 예를 들어 `revalidatePath("/products/[id]")` 등의 방식으로

  - A. 새로운 상품이 추가된 후 최초로 해당 페이지를 방문하는 사용자는 db에서 데이터를 받아 올 것이다. 그리고 정적 html이 생성된다. 이후에 해당 페이지에 방문하는 사용자는 static page를 보게 될것이다. 이는 기본 동작이다.

- **dynamicParams**

> dynamicParams는 generateStaticParams와 함께 사용되며, 특정 동적 경로가 미리 생성되지 않은 경우 어떻게 처리할지를 제어
>
> [공식문서](https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config#dynamicparams)

- dynamicParams: true (기본값)
  generateStaticParams에서 제공하지 않은 동적 세그먼트도 요청 시(on-demand) 자동 생성. 즉, 사용자가 해당 URL에 접근하면 서버에서 동적으로 렌더링하여 페이지를 제공할 수 있음. (Streaming Server Rendering 사용)

- dynamicParams: false
  generateStaticParams에서 반환되지 않은 동적 세그먼트는 404 페이지를 반환.
  즉, 정적으로 미리 생성된 페이지 외에는 접근할 수 없음.

- **Code challenge**

  1. 캐싱 전략을 짜고 상품 업로드, 수정, 삭제할 때마다 revalidate하기

  - `/home` 페이지
    -> static으로 빌드하고 revalidatePath 하는게 가장 효율적이어 보인다.
    -> 다만, `unstable-cache` 써보고 싶기 때문에 `force-dynamic` + `unstable-cache`를 함께 사용하여 캐싱후 태그로 revalidate 하는 방식으로 선택
  - `products/add` 페이지
    -> 일단 이건 페이지 이동이 필요함. 지금 intercept route에서 에러가 발생해서 페이지를 다른 URL로 변경하는게 시급.
    -> 새 상품이 업로드 될때마다 `#home` 태그 revalidate 하면 될 것 같음.
    -> `products/[id]`를 `/products/p/[id]` 로 옮기는게 좋다함 (GPT 센세 피셜)
  - `/products/p/[id]` 페이지
    -> 상품의 id를 특정할 수 없으므로 `revalidatePath`로 해당 페이지 전체를 revalidate 하는게 좋을 것 같음.
    -> 상품 수정 페이지와 연동해서 revalidate 하기

  2. 상품 수정 페이지 만들기

  - `/products/p/[id]/edit` 페이지
    -> 상품 수정 페이지. 상품 등록한 사람만 접근 가능하도록 하고 상품 기본값들 불러와서 defaultValue로 넣어놓고 수정후 submit하는 액션 구현 필요

### 12. Optimistic Updates

- **복합 ID 및 고유 제약 조건 사용**

> @@id는 Prisma 스키마에서 복합 기본 키를 정의할 때 사용하는 속성이ㅁ.
>
> 기본적으로 기본 키(Primary Key) 는 각 레코드를 고유하게 식별할 수 있는 열(Column)임. 단일 열을 기본 키로 설정할 수도 있지만, 두 개 이상의 열을 조합하여 고유한 식별자로 사용할 수도 있음. 이를 복합 기본 키(Composite Primary Key) 라고 함.
>
> 한 사용자가 같은 게시물(Post)에 좋아요를 여러 번 누를 수 없도록 제한하기 위해서 복합 기본 키를 사용할 수 있음.
>
> [공식문서](https://www.prisma.io/docs/orm/prisma-client/special-fields-and-types/working-with-composite-ids-and-constraints)

```prisma
  model Like {
    postId Int
    userId Int
    User User @relation(fields: [userId], references: [id])
    Post Post @relation(fields: [postId], references: [id])

    @@id(name: "likeId", [postId, userId])
  }
```

- **`_count`**

> `_count`는 Prisma에서 집계(Aggregation) 작업을 수행할 때 사용하는 특수한 필드로, 연관된 데이터의 개수를 구할 수 있다.
>
> [공식문서](https://www.prisma.io/docs/orm/prisma-client/queries/aggregation-grouping-summarizing#count)

```tsx
const usersWithCount = await prisma.user.findMany({
  include: {
    _count: {
      // 사용자가 작성한 게시물 수를 세기
      select: { posts: true },
    },
  },
});
```

- **숫자 필드 업데이트**

> Prisma에서 숫자 필드를 업데이트할 때는 원자적 연산(atomic operations)을 사용할 수 있다. 이 방법은 현재 값에 기반하여 숫자 필드를 더하기, 빼기, 곱하기 등의 연산을 수행할 수 있게 해줌. 주어진 예시처럼, increment를 사용하여 views와 likes를 1만큼 증가시킬 수 있다.
>
> [공식문서](https://www.prisma.io/docs/orm/prisma-client/queries/crud#update-a-number-field)

```tsx
const updatePosts = await prisma.post.updateMany({
  data: {
    views: {
      increment: 1, // views를 1 증가
    },
    likes: {
      increment: 1, // likes를 1 증가
    },
  },
});
```

- **views는 model Post의 필드로, Like는 다른 모델을 생성한 이유**

> 왜냐하면, 한 게시물에 대해 한명의 유저는 한개의 Like만 가질수 있음. 즉 Like는, 그 Like를 누른사람 및 게시글을 식별할 수 있어야하므로, 조회수랑 다르게, 따로 분리된 모델로 만듦.

- **Optimistic Update: 낙관적 업데이트.**

> 서버 호출이 성공했을 경우에 업데이트될 화면의 모습을 성공 여부와 관계 없이 즉각적으로 보여주기
>
> 기본적으로는 mutation이 발생하면, 서버의 데이터가 업데이트되고, 그 업데이트 결과를 받아서 화면에 표시한다. optimistic update를 활용하면, 서버의 응답을 기다리지 않고 클라이언트에서 그냥 화면을 업데이트할 수 있다.

- **useOptimistic**

  > [공식문서](https://react.dev/reference/react/useOptimistic)

  ```tsx
  /**
   * 첫번째 인자 - mutation이 발생하기 전 initial data
   * 두번째 인자 - 이전 상태를 조작할 콜백 함수
   *             -> prevstate (이전 상태)
   *             -> payload (추가적인 데이터)
   */
  const [state, reducerFn] = useOptimistic(
    { isLiked, likeCount },
    (
      prevState,
      payload // unused
    ) => ({
      isLiked: !prevState.isLiked,
      likeCount: prevState.isLiked
        ? prevState.likeCount - 1
        : prevState.likeCount + 1,
    })
  );

  const onClick = async () => {
    // useOptimistic을 통해 서버의 결과가 결정되기 전 먼저 결과를 ui에 보여준다
    // reducerFn는 startTransition으로 감싼 후에 사용해야 한다.
    startTransition(() => {
      reducerFn(null);
    });

    // 먼저 결과를 보여준 후 실제 서버가 동작한다.
    if (isLiked) {
      await dislikePost(postId);
    } else {
      await likePost(postId);
    }
  };
  ```

- **왜 useState 냅두고 useOptimistic을 쓸까?**

1. startTransition을 활용한 UI 렌더링 최적화

   - setState를 사용하면 상태가 바뀔 때마다 동기적으로 렌더링이 발생함.
   - 반면, useOptimistic을 startTransition과 함께 사용하면 UI가 `부드럽게 동작`하고, 백그라운드에서 상태 변경을 처리할 수 있다.

2. 서버 응답에 따라 최종적인 상태를 동기화할 때
   - useOptimistic의 payload를 사용하면, 낙관적 업데이트 후 서버 응답에 따라 최종 상태를 업데이트하는 방식도 가능.
   - 예를 들어, 서버에서 예상치 못한 에러가 발생하면 상태를 원래대로 되돌릴 수도 있음.
   - 근데 이건 state도 되긴 함.

- **startTransition**

  - startTransition은 낮은 우선순위의 상태 업데이트를 백그라운드에서 실행하여 (= 실행을 나중에 한다는 의미) UI 버벅임을 방지하는 기능.
  - 특히 낙관적 UI 업데이트 (useOptimistic)와 함께 사용하면 더 부드러운 경험을 제공.
  - 하지만 단순한 상태 변경에는 불필요하므로, 무거운 렌더링이 예상될 때만 사용하는 것이 좋음.

  ```tsx
  function Example() {
    const [count, setCount] = useState(0);
    const [list, setList] = useState<number[]>([]);

    const handleClick = () => {
      // ✅ 즉각적인 업데이트 (높은 우선순위)
      setCount((prev) => prev + 1);

      // ✅ 낮은 우선순위로 실행됨 (백그라운드)
      startTransition(() => {
        setList(Array(20000).fill(count)); // 무거운 업데이트
      });
    };

    return (
      <div>
        <button onClick={handleClick}>증가</button>
        <p>Count: {count}</p>
        <ul>
          {list.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
    );
  }
  ```

  > **실행흐름**
  >
  > 1. 버튼을 클릭하면 setCount((prev) => prev + 1)이 즉시 실행되어 카운터 값이 먼저 증가.
  >
  > 2. startTransition(() => setList(...))는 백그라운드에서 실행되므로, React가 여유가 있을 때 실행됨.
  >
  > 3. 결과적으로 UI가 끊기지 않고 부드럽게 동작.

### 13. Prisma getter 함수 반환 타입 알아내기

```tsx
export type InitialChatMessages = Prisma.PromiseReturnType<typeof getMessages>;
```

### 14. Real Time Chat with Supabase

- **Supabase**

> dasthboard -> api key copy -> projects setting -> data api -> url copy
>
> [채널 연결하기](https://supabase.com/docs/guides/realtime/broadcast)

```bash
npm i @supabase/supabase-js
```

```tsx
useEffect(() => {
  // supabase 클라이언트 생성하기
  const client = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_API_KEY!
  );

  // supabase channel(room) 생성하기
  // 채널 생성 시 고유한 아이디 필요 -> prisma chatRoom model id
  channel.current = client.channel(`room-${chatRoomId}`);
  // 이벤트 이름으로 필터링
  channel.current
    .on("broadcast", { event: "test" }, (payload) => {
      console.log(payload);
    })
    .subscribe();

  // clean up
  return () => {
    channel.current?.unsubscribe();
  };
}, []);

function sendMessage() {
  // channel에 실제 메시지 보내기
  channel.current?.send({
    type: "broadcast",
    // client 연결할때 사용한 event 이름이랑 같아야함
    event: "test",
    payload: { message },
  });
}
```

#### Code Challange - Real Time Message Complete

1. 채팅창 목록을 구현하자. 새 메시지가 오면 해당 채팅방을 최상단으로 올리고, 읽지 않는 메시지도 우측에 보이도록 하자
2. 메시지 읽음/읽지 않음 상태를 실시간으로 변동 가능하도록 구현하자

- Q. 메시지를 읽는 사용자는 어떤 상황인가?

  - A. 메시지를 보내는 사용자
  - A. 다른 사용자가 보낸 메시지가 존재하는 채팅방에 사용자가 입장

- **presense**

  > Presence는 실시간 사용자의 상태(state)를 추적하는 기능을 제공하는 Supabase의 Realtime API 중 하나
  >
  > 실시간 메시지 읽음/안읽음 상태 변경을 위해 사용

  ```tsx
  channel.current = client.channel(`room-${chatRoomId}`, {
    // presense key를 userId로 설정하기
    config: {
      presence: {
        key: String(userId),
      },
    },
  });

  // 유저 상태
  const userStatus = {
    user: userId,
    online_at: new Date().toISOString(),
  };

  channel.current
    // 접속자 공동 관리
    .on("presence", { event: "sync" }, () => {
      // online인 사용자의 정보 (userStatus) 담는 객체
      const newState = channel.current?.presenceState();
      // 접속중인 userId 배열
      const onlineUser = Object.keys(newState!);
    })
    .on("presence", { event: "join" }, ({ key, newPresences }) => {
      // 사용자가 채팅방에 들어왔을 때 실행되는 콜백
    })
    .on("presence", { event: "leave" }, ({ key, leftPresences }) => {
      // 사용자가 채팅방에 떠났을 때 실행되는 콜백
    })
    .on("broadcast", { event: "message" }, async (payload) => {
      // 메시지 이벤트 수신 (송신자가 메시지 입력시 수신자 단에서 실행)
      // 받은 메시지 ui에 추가하기
      setMessages((prev) => [...prev, payload.payload]);
    })
    .subscribe(async (status) => {
      if (status !== "SUBSCRIBED") {
        return;
      }
      // 사용자 상태 정보 (userStatus) 모든 접속중인 사용자에게 뿌리기
      await channel.current?.track(userStatus);
    });

  // clean up
  return () => {
    channel.current?.unsubscribe();
  };
  ```

- **결론**

  - 핵심 : `presense`를 통해 현재 접속한 사용자가 누구인지 확인한다.

  - 접속한 사용자가 본인 이외에 존재할 떄
    - case 1) 새로운 메시지를 보낸다.
      - 임시 메시지에 본인을 포함한 read 객체를 추가하여 접속중인 사용자에 한해 read 상태로 만든다.
    - case 2) 특정 사용자가 이미 사용자가 입장해 있는 채팅방에 접속한다.
      - sync 이벤트를 통해 모든 메시지 상태에 대해 새롭게 입장한 사용자에 대한 read 상태를 추가한다.
  - 위 상황에서 실제 db의 read를 변경해야하는가?
    - 어짜피 새로고침하거나 방에 다시 들어올때 기존 메시지 모두 읽음 처리 돼서 상관없을듯

### 15. Next Font

```tsx
// layout.tsx
import { Sigmar } from "next/font/google";
import localFont from "next/font/local";

// google font 사용하기
const sigmar = Sigmar({
  weight: "400",
  style: "normal",
  subsets: ["latin"],
  // class 이름 설정
  variable: "--sigmar-boy",
});

// local font 사용하기
const metalica = localFont({
  src: "./metalica.ttf",
  variable: "--metalica-text",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        // 폰트 변수명 등록하기
        className={`${sigmar.variable} ${metalica.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
```

```ts
import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // font 확장
      fontFamily: {
        sigmar: "var(--sigmar-boy)",
        metalica: "var(--metalica-text)",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
} satisfies Config;
```

### 16. Private Folders

> Private 폴더는 폴더 앞에 밑줄(\_folderName)을 붙여 생성할 수 있다.
>
> [공식문서](https://nextjs.org/docs/app/building-your-application/routing/colocation#private-folders)

### 17. Catch-all Segments

> 대괄호 [...folderName] 안에 줄임표를 추가하면 동적 세그먼트를 모든 후속 세그먼트로 확장할 수 있다.
>
> [공식문서](https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes#catch-all-segments)

### 18. Optinal Segements

> route/[[id]] 는 id params가 작성되지 않아도 동작 가능하다.

### 19. Security

```ts
// next.config.ts
const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    taint: true,
  },
};
```

```tsx
const secret = {
  api_key: "1234",
  secret_key: "secret",
};

experimental_taintObjectReference("secret key 유출시 1억", secret);
// 특정 key만 유출 방지
experimental_taintUniqueValue("1억끼얏호우", secret, secret.secret_key);
```

> **클라이언트에서 사용시 에러 발생**
>
> ⨯ Error: api key 유출시 1억
> at stringify (<anonymous>) {
> digest: '847966630'
> }

```bash
npm i server-only
```

> 서버 컴포넌트에서만 사용 가능한 파일 만들기

### 20. Image Placeholder

```tsx
  //로컬 이미지는 placholer로 blur 주는거 추천
  <Image src={Sango} alt="이미지" placeholder="blur" />
  //외부 이미지인 경우엔 placholder로 base64 인코딩된 이미지 넣으면 됨
  <Image
    src={Segu}
    alt="이미지"
    // placehlder image blur 처리
    placeholder="blur"
    // placeholder 이미지
    blurDataURL="base24IncodedImage"
  />
```

> 이미지 base 64 인코딩하는 곳
>
> https://www.base64-image.de

### 21. Live Streaming with CloudFlare

- **Create Live Input(get Stream Id, Stream Key)**

> [공식문서](https://developers.cloudflare.com/stream/get-started/#step-1-create-a-live-input)

```curl
curl -X POST \
-H "Authorization: Bearer <API_TOKEN>" \
-D '{"meta": {"name":"test stream"},"recording": { "mode": "automatic" }}' \
https://api.cloudflare.com/client/v4/accounts/<ACCOUNT_ID>/stream/live_inputs
```

```json
// response
{
  "uid": "f256e6ea9341d51eea64c9454659e576",
  "rtmps": {
    "url": "rtmps://live.cloudflare.com:443/live/",
    "streamKey": "MTQ0MTcjM3MjI1NDE3ODIyNTI1MjYyMjE4NTI2ODI1NDcxMzUyMzcf256e6ea9351d51eea64c9454659e576"
  },
  "created": "2021-09-23T05:05:53.451415Z",
  "modified": "2021-09-23T05:05:53.451415Z",
  "meta": {
    "name": "test stream"
  },
  "status": null,
  "recording": {
    "mode": "automatic",
    "requireSignedURLs": false,
    "allowedOrigins": null
  }
}
```

```tsx
// use in actions
const response = await fetch(
  `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/stream/live_inputs`,
  {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.CLOUDFLARE_API_KEY}`,
    },
    body: JSON.stringify({
      meta: { name: titleResult.data },
      recording: { mode: "automatic" },
    }),
  }
);

const data = await response.json();

// get userId
const session = await getSession();

// save stream id, stream key in db
const stream = await db.liveStream.create({
  data: {
    title: titleResult.data,
    stream_id: data.result.uid,
    stream_key: data.result.rtmps.streamKey,
    userId: session.id!,
  },
});
```

- **Play Live Streaming**

> [공식문서](https://developers.cloudflare.com/stream/get-started/#step-3-play-the-live-stream-in-your-website-or-app)

```jsx
<iframe
  src="https://customer-<CODE>.cloudflarestream.com/<VIDEO_UID>/iframe"
  title="Example Stream video"
  frameBorder="0"
  allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
  allowFullScreen
></iframe>
```
