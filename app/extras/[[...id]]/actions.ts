// 서버 컴포넌트만 import 가능하도록
import "server-only";

export async function fetchData() {
  fetch("....");
}
