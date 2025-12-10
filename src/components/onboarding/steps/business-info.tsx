"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, Ref, useImperativeHandle, useState, useRef } from "react";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ref as fRef,
  getDownloadURL,
  uploadBytesResumable,
} from "firebase/storage";
import { storage } from "@/services/firebase";
import toast from "react-hot-toast";
import { ChevronLeft, ChevronRight, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import useEmblaCarousel from "embla-carousel-react";

export const countries = [{ value: "United Kingdom", label: "United Kingdom" }];

const businessInfoSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Business name must be at least 2 characters" }),
  phone: z.string().min(10, { message: "Please enter a valid phone number" }),
  logoUrl: z.string().optional(),
  address: z
    .string()
    .min(3, { message: "Address must be at least 3 characters" }),
  display_address: z.boolean().default(true),
  city: z.string().min(2, { message: "City must be at least 2 characters" }),
  state: z
    .string()
    .min(2, { message: "State/province must be at least 2 characters" }),
  postalCode: z
    .string()
    .min(4, { message: "Postal code must be at least 4 characters" }),
  country: z.string().min(1, { message: "Please select a country" }),
  aboutUs: z
    .string()
    .min(24, { message: "About Us must be at least 24 characters" })
    .max(500, { message: "Banner header must be at most 500 characters" }),
  images: z.array(z.string()).min(1, "At least one banner image is required"),
});

type BusinessInfoData = z.infer<typeof businessInfoSchema>;

interface BusinessInfoStepProps {
  data: OnboardingFormData;
  onUpdate: (data: BusinessInfoData & { logoUrl?: string }) => void;
  ref: Ref<{ validate: () => Promise<boolean> }>;
}

const CarouselButton = ({
  direction,
  onClick,
}: {
  direction: "left" | "right";
  onClick: () => void;
}) => (
  <Button
    type="button"
    variant="outline"
    size="icon"
    className="absolute top-1/2 -translate-y-1/2 h-8 w-8 rounded-full border-gray-200 bg-white/80 z-10"
    style={{ [direction]: "1rem" }}
    onClick={onClick}
  >
    {direction === "left" ? (
      <ChevronLeft className="h-4 w-4" />
    ) : (
      <ChevronRight className="h-4 w-4" />
    )}
  </Button>
);

const DotButton = ({
  selected,
  onClick,
}: {
  selected: boolean;
  onClick: () => void;
}) => (
  <button
    className={`relative h-2 w-2 rounded-full mx-1 ${
      selected ? "bg-[#7B68EE]" : "bg-[#E0E0E5]"
    }`}
    type="button"
    onClick={onClick}
  />
);

export function BusinessInfoStep({
  data,
  onUpdate,
  ref,
}: BusinessInfoStepProps) {
  const form = useForm<BusinessInfoData>({
    mode: "all",
    resolver: zodResolver(businessInfoSchema),
    defaultValues: data.businessInfo,
  });

  const formRef = useRef<HTMLFormElement | null>(null);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onError = (errors: any) => {
    if (!formRef.current) return;
    const firstErrorField = Object.keys(errors)[0];
    const errorElement = formRef.current.querySelector(
      `[name="${firstErrorField}"]`
    );
    if (errorElement) {
      errorElement.scrollIntoView({ behavior: "smooth", block: "center" });
      (errorElement as HTMLElement).focus();
    }
  };

  const logoUrl = form.watch("logoUrl") || null;
  const images = form.watch("images") || [];

  useImperativeHandle(ref, () => ({
    async validate() {
      const isValid = await form.trigger(); // runs validation
      if (!isValid) {
        onError(form.formState.errors);
      }
      if (isValid) {
        onUpdate({
          ...form.getValues(),
        });
      }
      return isValid;
    },
  }));
  // Handle logo upload
  const handleLogoUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      // toast.loading('Uploading logo...', { id: 'logo-upload' });
      const storageRef = fRef(storage, `bnb/${Date.now()}/logo`);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          toast.loading(`Uploading logo... ${Math.round(progress)}%`, {
            id: "logo-upload-percentage",
          });
          if (progress === 100) {
            toast.dismiss("logo-upload-percentage");
            toast.success("Logo uploaded successfully", { id: "logo-upload" });
          }
        },
        (error) => toast.error(error.message),
        () =>
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            form.setValue("logoUrl", downloadURL);
            onUpdate({
              ...form.getValues(),
            });
          })
      );
    } catch (error: unknown) {
      console.error("Failed to upload logo:", error);
      toast.error("Failed to upload logo", { id: "logo-upload" });
    }
  };

  const removeLogo = () => {
    form.setValue("logoUrl", "");
    onUpdate({
      ...form.getValues(),
    });
  };

  useEffect(() => {
    const onSelect = () => {
      setSelectedIndex(emblaApi?.selectedScrollSnap() || 0);
    };

    emblaApi?.on("select", onSelect);
    return () => {
      emblaApi?.off("select", onSelect);
    };
  }, [emblaApi]);

  const handleBannerImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (
      !file ||
      (data.businessInfo.images && data.businessInfo.images.length >= 10)
    )
      return;
    try {
      // toast.loading('Uploading logo...', { id: 'logo-upload' });
      const storageRef = fRef(storage, `bnb/${Date.now()}/banner-image`);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          toast.loading(`Uploading logo... ${Math.round(progress)}%`, {
            id: "image-upload",
          });
          if (progress === 100) {
            toast.dismiss("image-upload");
            toast.success("Logo uploaded successfully", { id: "image-upload" });
          }
        },
        (error) => toast.error(error.message),
        () =>
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            form.setValue("images", [...images, downloadURL]);
            onUpdate({
              ...form.getValues(),
            });
          })
      );

      toast.success("Banner image uploaded successfully", {
        id: "image-upload",
      });
    } catch (error: unknown) {
      console.error("Failed to upload image:", error);
      toast.error("Failed to upload image", {
        id: "image-upload",
      });
    }
  };

  const removeBanner = (id: string) => {
    form.setValue(
      "images",
      images.filter((src) => src !== id)
    );
    onUpdate({
      ...form.getValues(),
    });
  };

  return (
    <Form {...form}>
      <form ref={formRef} className="space-y-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-[#121212]">
            Business Information
          </h2>
          <p className="text-sm text-[#6E6E73]">Tell us about your business</p>
        </div>
        <FormItem>
          <FormLabel>Business Logo</FormLabel>
          <div className="mt-2">
            {logoUrl ? (
              <div className="relative h-40 w-40 mx-auto">
                <Image
                  src={logoUrl || "/placeholder.svg"}
                  width={160}
                  height={160}
                  placeholder="blur"
                  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mM8++JFPQAIRQMetjSWgwAAAABJRU5ErkJggg=="
                  alt="Business Logo"
                  className="rounded-full h-40 w-40 shadow-xl"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="absolute -right-2 -top-2 h-7 w-7 rounded-full border-gray-200 bg-white"
                  onClick={removeLogo}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-center rounded-md border border-dashed border-[#E0E0E5] px-6 py-10">
                <div className="text-center">
                  <Upload className="mx-auto h-12 w-12 text-[#6E6E73]" />
                  <div className="mt-2 flex text-sm leading-6 text-[#6E6E73]">
                    <label
                      htmlFor="logo-upload"
                      className="relative cursor-pointer rounded-md font-semibold text-[#7B68EE]"
                    >
                      <span>Upload a file</span>
                      <input
                        id="logo-upload"
                        name="logo-upload"
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={handleLogoUpload}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-[#6E6E73]">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>
              </div>
            )}
          </div>
          <FormDescription className="text-center">
            Your logo will appear on your booking page and receipts
          </FormDescription>
        </FormItem>

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Business Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter your business name" {...field} />
              </FormControl>
              <FormDescription>
                This is how your business will appear to clients
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="aboutUs"
          render={({ field }) => (
            <FormItem>
              <FormLabel>About Us</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="e.g Discover beauty at BeautySpot"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Write a friendly introduction to your business. This will appear
                in the “About” section of your booking page. Mention what you
                do, who you serve, and what makes your service special.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Business Phone</FormLabel>
              <FormControl>
                <Input placeholder="(555) 123-4567" {...field} />
              </FormControl>
              <FormDescription>
                A phone number where clients can reach you
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-[#121212]">
            Business Location
          </h2>
          <p className="text-sm text-[#6E6E73]">
            Where is your business located?
          </p>
        </div>

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Street Address</FormLabel>
              <FormControl>
                <Input placeholder="123 Main St" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="display_address"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-2 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Display address on booking page</FormLabel>
                <FormDescription>
                  Allow customers to see your business address on your booking
                  page
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input placeholder="City" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>State/Province</FormLabel>
                <FormControl>
                  <Input placeholder="State/Province" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="postalCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Postal Code</FormLabel>
                <FormControl>
                  <Input placeholder="Postal Code" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <Select
                  name="country"
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a country" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem key={country.value} value={country.value}>
                        {country.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormItem>
            <FormLabel>
              Upload banner images [{images.length}/10] (min: 1, max: 10)
            </FormLabel>
            <div className="mt-2">
              {images.length < 10 && (
                <div className="flex items-center justify-center rounded-md border border-dashed border-[#E0E0E5] px-6 py-10">
                  <div className="text-center">
                    <Upload className="mx-auto h-12 w-12 text-[#6E6E73]" />
                    <div className="mt-2 flex text-sm leading-6 text-[#6E6E73]">
                      <label
                        htmlFor="banner-image-upload"
                        className="relative cursor-pointer rounded-md font-semibold text-[#7B68EE]"
                      >
                        <span>Upload a file</span>
                        <input
                          id="banner-image-upload"
                          name="banner-image-upload"
                          type="file"
                          accept="image/*"
                          className="sr-only"
                          onChange={handleBannerImageUpload}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-[#6E6E73]">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                </div>
              )}
              {images.length > 0 && (
                <div className="relative h-80 w-full mt-2">
                  <div className="h-full w-full">
                    <div className="overflow-hidden h-full" ref={emblaRef}>
                      <div className="flex h-full">
                        {images.map((img, index) => (
                          <div
                            key={img}
                            className="relative flex-[0_0_100%] min-w-0"
                          >
                            <Image
                              src={img || "/placeholder.svg"}
                              alt={`Banner image ${index + 1}`}
                              fill
                              placeholder="blur"
                              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mM8++JFPQAIRQMetjSWgwAAAABJRU5ErkJggg=="
                              className="rounded-md object-contain"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              className="absolute right-2 top-2 h-7 w-7 rounded-full border-gray-200 bg-white"
                              onClick={() => removeBanner(img)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                    {images.length > 1 && (
                      <>
                        <CarouselButton
                          direction="left"
                          onClick={() => emblaApi?.scrollPrev()}
                        />
                        <CarouselButton
                          direction="right"
                          onClick={() => emblaApi?.scrollNext()}
                        />
                        <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                          {images.map((_, index) => (
                            <DotButton
                              key={index}
                              selected={index === selectedIndex}
                              onClick={() => emblaApi?.scrollTo(index)}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
            <FormDescription className="text-center">
              Your images will appear on the hero section of your booking page
            </FormDescription>
          </FormItem>
        </div>

        <FormDescription className="pt-2">
          This information will be displayed on your booking page and helps
          clients find your business
        </FormDescription>
      </form>
    </Form>
  );
}
