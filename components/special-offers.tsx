"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Users } from "lucide-react"

export function SpecialOffers() {
  return (
    <section className="py-16 bg-gray-900">
      <div className="container mx-auto px-4">


        {/* Call to Action */}
        <div className="text-center mt-12">
          <div className="bg-gradient-to-r from-red-600 to-red-800 rounded-2xl p-8 md:p-12">
            <h3 className="text-3xl md:text-4xl font-black text-white mb-4">
              FALE CONOSCO
            </h3>
            <p className="text-lg text-white/90 mb-6 max-w-2xl mx-auto">
              Tem alguma dúvida? Nossa equipe está pronta para te ajudar!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-red-600 hover:bg-gray-100 font-bold px-8 py-4 rounded-full shadow-lg transition-all duration-300"
              >
                <Users className="mr-2 w-5 h-5" />
                WHATSAPP
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-white text-white hover:bg-white hover:text-red-600 font-bold px-8 py-4 rounded-full transition-all duration-300"
              >
                INSTAGRAM
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
