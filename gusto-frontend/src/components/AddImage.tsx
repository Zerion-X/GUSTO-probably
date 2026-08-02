import { useRef, useState } from "react";
import { ImagePlus } from "lucide-react";

type ImageUploadBoxProps = {
  image: string;
  onImageSelect: (image: string) => void;
  editImg?: string;
  type?: string;
};

export default function ImageUploadBox({
  image,
  onImageSelect,
  editImg,
  type,
}: ImageUploadBoxProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setShow(false);
    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      onImageSelect(reader.result as string);
    };

    reader.readAsDataURL(file);
  };
  const [show, setShow] = useState(true);
  
  return (
    <div className="w-full">
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleChange}
        className="hidden"
      />

      <div
        onClick={handleClick}
        className="group relative flex h-[620px] w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-[28px] border border-dashed border-[#C47A2C]/40 bg-gradient-to-br from-[#FFF8EA] to-white p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:border-[#C47A2C] hover:shadow-xl"
      >
        
      {type === "edit" && editImg ? (
        <>
          <img
            src={ show ? editImg : image}
            alt="preview"
            className="h-full w-full rounded-[24px] object-cover"
          />
          <div className="absolute inset-0 flex items-end justify-center rounded-[24px] bg-gradient-to-t from-black/40 via-transparent to-transparent p-4">
            <span className="rounded-full bg-white/85 px-4 py-2 text-sm font-semibold text-[#3A2419]">
              Tap to change image
            </span>
          </div>
        </>
      ) : image ? (
        <>
          <img
            src={image}
            alt="preview"
            className="h-full w-full rounded-[24px] object-cover"
          />
          <div className="absolute inset-0 flex items-end justify-center rounded-[24px] bg-gradient-to-t from-black/40 via-transparent to-transparent p-4">
            <span className="rounded-full bg-white/85 px-4 py-2 text-sm font-semibold text-[#3A2419]">
              Tap to change image
            </span>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center gap-3">
          <div className="rounded-full border border-[#C47A2C]/20 bg-white/80 p-4 text-[#8B5A3C] shadow-sm">
            <ImagePlus size={28} />
          </div>
          <div>
            <p className="text-lg font-semibold text-[#3A2419]">
              Upload a beautiful photo
            </p>
            <p className="mt-1 text-sm text-[#8B5A3C]/80">
              PNG, JPG, or WEBP for your recipe post
            </p>
          </div>
        </div>
      )}

      </div>
    </div>
  );
}
