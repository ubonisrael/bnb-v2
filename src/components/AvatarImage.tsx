import React from "react";

const AvatarImage: React.FC<{ url: string; name: string }> = ({ url, name }) => {
  if (!url) {
    const initials = name
      .split(' ')
      .slice(0, 2)
      .map(word => word[0])
      .join('')
      .toUpperCase() || name.slice(0, 2).toUpperCase();

    return (
      <div className="h-10 w-10 rounded-full bg-black text-white flex items-center justify-center">
        {initials}
      </div>
    );
  }

  return (
    <img
      className="h-10 w-10 rounded-full"
      src={url}
      alt={`${name} Logo`}
    />
  );
};

export default AvatarImage;