import { useState } from "react";

export default function useFormPicture({
  initialValue,
  form,
}: {
  initialValue?: string;
  form: any;
}) {
  const [tempPicture, setTempPicture] = useState(initialValue);
  const selectPicture = (picture: string) => {
    setTempPicture(picture);
    form.setValue("picture", picture);
  };
  return { picture: tempPicture, setPicture: selectPicture };
}
