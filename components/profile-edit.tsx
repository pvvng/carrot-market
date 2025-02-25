"use client";

import { editUser } from "@/app/(tabs)/profile/edit/actions";
import { UserType } from "@/app/(tabs)/profile/edit/page";
import Button from "@/components/button";
import Input from "@/components/input";
import { getUploadUrl } from "@/lib/data/upload-url";
import { PhotoIcon } from "@heroicons/react/24/solid";
import { useActionState, useState } from "react";

const MAX_FILE_SIZE_MB = 1;

export default function ProfileEditForm({ user }: { user: UserType }) {
  const [uploadUrl, setUploadUrl] = useState("");
  const [preview, setPreview] = useState<string>(
    !user.avatar ? "" : user.avatar
  );
  const [imageId, setImageId] = useState<string | null>(null);

  const interceptAction = async (_: any, formData: FormData) => {
    // 이미지에 변화가 없을때
    if (preview?.endsWith("public")) {
      formData.set("photo", preview.replace(/\/public$/, ""));

      return editUser(_, formData);
    }

    // upload image
    const file = formData.get("photo");

    if (!file || !uploadUrl) {
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
      alert("이미지 업로드에 실패했습니다. 새로고침 후 다시 시도해주세요.");
      return;
    }

    // replace photo in formdata
    const photoUrl = `https://imagedelivery.net/MR01-6_39Z4fkK0Q1BsXww/${imageId}`;
    formData.set("photo", photoUrl);

    // call uploadProduct Action
    // await이 아닌 return 사용하기
    return editUser(_, formData);
  };

  const onImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (!files || files.length == 0) {
      // 취소버튼 클릭하면 초기화 시켜야함
      setPreview("");
      setImageId(null);
      return;
    }

    const file = files[0];

    if (!file.type.startsWith("image")) {
      alert("이미지 파일만 업로드 할 수 있습니다.");
      return;
    }

    if (MAX_FILE_SIZE_MB < file.size / (1024 * 1024)) {
      alert(`최대 ${MAX_FILE_SIZE_MB}MB의 이미지만 업로드 할 수 있습니다.`);
      return;
    }

    const url = URL.createObjectURL(file);
    setPreview(url);

    const { success, result } = await getUploadUrl();

    if (!success) {
      alert("이미지 업로드에 실패했습니다.");
      return;
    }

    const { id, uploadURL } = result;
    setUploadUrl(uploadURL);
    setImageId(id);
  };

  const [state, action] = useActionState(interceptAction, null);

  return (
    <form action={action} className="p-5 mb-24 flex flex-col gap-3">
      <label
        htmlFor="photo"
        className="border-2 bg-neutral-200 border-neutral-200 rounded-full aspect-square 
          flex flex-col items-center justify-center text-black cursor-pointer bg-center bg-cover"
        style={{ backgroundImage: `url(${preview})` }}
      >
        {preview === "" && (
          <>
            <PhotoIcon className="w-20" />
            <div className="text-neural-400 text-sm">
              {state?.fieldErrors.photo
                ? state?.fieldErrors.photo
                : "사진을 추가해주세요."}
            </div>
          </>
        )}
      </label>
      <input
        type="file"
        id="photo"
        name="photo"
        className="hidden"
        accept="image/*"
        onChange={onImageChange}
      />
      <Input
        name="username"
        type="text"
        placeholder="username"
        defaultValue={user.username}
        required
        errors={state?.fieldErrors.username}
      />
      <Button text="수정하기" />
    </form>
  );
}
