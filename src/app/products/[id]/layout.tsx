import { Metadata } from "next";
import { prisma } from "@/lib/prisma";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  try {
    const product = await prisma.listing.findUnique({
      where: { id },
      include: { media: true }
    });

    if (!product) {
      return { title: "کالا یافت نشد" };
    }

    const imageUrl = product.media?.[0]?.url || "/favicon.ico";

    return {
      title: product.title,
      description: product.description || `خرید ${product.title} از بازارگاه نیکو`,
      openGraph: {
        title: product.title,
        description: product.description || `خرید ${product.title} از بازارگاه نیکو`,
        images: [imageUrl],
      },
    };
  } catch {
    return { title: "جزئیات کالا" };
  }
}

export default function ProductLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}