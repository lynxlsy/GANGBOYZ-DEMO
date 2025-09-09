"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

interface CategoryItem {
  id: string
  name: string
  image: string
  description: string
  link: string
}

const exploreCategories: CategoryItem[] = [
  {
    id: "oversized",
    name: "Oversized",
    image: "/black-t-shirt-with-neon-graphic-design.jpg",
    description: "Looks confortáveis e despojados",
    link: "/camisetas"
  },
  {
    id: "estampas",
    name: "Estampas",
    image: "/black-t-shirt-with-neon-graphic-design.jpg", 
    description: "Designs únicos e exclusivos",
    link: "/camisetas"
  },
  {
    id: "lisos",
    name: "Lisos",
    image: "/black-streetwear-hoodie-with-white-logo.jpg",
    description: "Cores sólidas e minimalistas",
    link: "/camisetas"
  },
  {
    id: "shorts",
    name: "Shorts",
    image: "/black-cargo-streetwear.png",
    description: "Conforto para o dia a dia",
    link: "/roupas"
  },
  {
    id: "verao",
    name: "Verão",
    image: "/black-t-shirt-with-neon-graphic-design.jpg",
    description: "Pieces para dias quentes",
    link: "/camisetas"
  },
  {
    id: "inverno",
    name: "Inverno", 
    image: "/black-streetwear-hoodie-with-white-logo.jpg",
    description: "Aquecimento com estilo",
    link: "/roupas"
  }
]

export function ExploreCategories() {
  return (
    <section className="py-16 bg-gray-200">
      <div className="container mx-auto px-4">
        {/* Título Principal */}
        <div className="text-center mb-32">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-12">
            BORA EXPLORAR NA GANG BOYZ?
          </h2>
        </div>

        {/* Categorias em linha horizontal */}
        <div className="flex justify-center items-center gap-8 md:gap-12 lg:gap-16 xl:gap-20">
          {exploreCategories.map((category) => (
            <Link key={category.id} href={category.link} className="group cursor-pointer">
              <div className="text-center">
                {/* Imagem Circular */}
                <div className="relative mb-6 mx-auto w-48 h-48">
                  <div className="w-full h-full rounded-full overflow-hidden">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                </div>
                
                {/* Nome da Categoria */}
                <h3 className="text-xl font-bold text-black">
                  {category.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
