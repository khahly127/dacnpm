import Image from 'next/image';

interface BrandHeaderProps {
  title?: string;
  slogan?: string;
}

export function BrandHeader({
  title = 'Casa Cozy',
  slogan = 'Bếp ấm & Bàn ăn • Trải nghiệm ẩm thực trọn vẹn',
}: BrandHeaderProps) {
  return (
    <div className="flex flex-col items-center text-center select-none">
      {/* Logo Squircle Card - Phóng to bao quát trọn vẹn khung hình */}
      <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-[28px] bg-[#F7F2EA] border-2 border-[#EAE0D2] shadow-[0_6px_20px_rgba(0,0,0,0.04)] flex items-center justify-center p-2 overflow-hidden transition-transform duration-300 hover:scale-105">
        <div className="relative w-full h-full rounded-[20px] overflow-hidden flex items-center justify-center bg-white/50">
          <Image
            src="/images/logo.jpg"
            alt="Casa Cozy Bistro"
            fill
            sizes="128px"
            className="object-cover scale-110"
            priority
          />
        </div>
      </div>

      {/* Brand Title */}
      <h1 className="mt-4 text-2xl sm:text-[26px] font-bold tracking-tight text-[#231F20]">
        {title}
      </h1>

      {/* Brand Slogan */}
      <p className="mt-1 text-xs sm:text-[13px] font-medium text-[#8B2323] tracking-wide">
        {slogan}
      </p>
    </div>
  );
}
