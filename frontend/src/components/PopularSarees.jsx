import React from "react";

const PopularSarees = () => {
  return (
    <section className="w-full bg-white py-16">
      <div className="max-w-7xl mx-auto px-4">

        {/* Title */}
        <h2 className="text-center text-3xl font-semibold text-[#082e21] mb-12">
          Popular Sarees
        </h2>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

          {/* Left Column */}
          <div className="space-y-10">

            {/* Bridal Sarees */}
            <div>
              <h3 className="text-xl font-semibold text-[#082e21] text-center">
                Bridal Sarees
              </h3>
              <p className="text-center text-gray-600 mt-3 leading-relaxed">
                Banarasi Sarees | Kanjivaram Sarees | Designer Bridal Sarees |  
                Zari Work Sarees | Handloom Bridal Sarees | Silk Bridal Sarees
              </p>
              <div className="w-full h-[1px] bg-[#ecc153] mt-6"></div>
            </div>

            {/* Traditional Sarees */}
            <div>
              <h3 className="text-xl font-semibold text-[#082e21] text-center">
                Traditional Sarees
              </h3>
              <p className="text-center text-gray-600 mt-3 leading-relaxed">
                Cotton Sarees | Linen Sarees | Chanderi Sarees | Tant Sarees |  
                Kalamkari Sarees | Paithani Sarees | Handloom Sarees
              </p>
              <div className="w-full h-[1px] bg-[#ecc153] mt-6"></div>
            </div>

            {/* Party Wear */}
            <div>
              <h3 className="text-xl font-semibold text-[#082e21] text-center">
                Party Wear Sarees
              </h3>
              <p className="text-center text-gray-600 mt-3 leading-relaxed">
                Sequin Sarees | Net Sarees | Georgette Sarees | Organza Sarees |  
                Designer Sarees | Ruffle Sarees | Cocktail Sarees
              </p>
              <div className="w-full h-[1px] bg-[#ecc153] mt-6"></div>
            </div>

          </div>

          {/* Right Column */}
          <div className="space-y-10">

            {/* Silk Sarees */}
            <div>
              <h3 className="text-xl font-semibold text-[#082e21] text-center">
                Silk Sarees
              </h3>
              <p className="text-center text-gray-600 mt-3 leading-relaxed">
                Kanjivaram Silk | Banarasi Silk | Mysore Silk | Tussar Silk |  
                Raw Silk | Soft Silk | Art Silk Sarees
              </p>
              <div className="w-full h-[1px] bg-[#ecc153] mt-6"></div>
            </div>

            {/* Daily Wear */}
            <div>
              <h3 className="text-xl font-semibold text-[#082e21] text-center">
                Daily Wear Sarees
              </h3>
              <p className="text-center text-gray-600 mt-3 leading-relaxed">
                Cotton Sarees | Printed Sarees | Simple Sarees | Office Wear Sarees |  
                Casual Sarees | Lightweight Sarees
              </p>
              <div className="w-full h-[1px] bg-[#ecc153] mt-6"></div>
            </div>

            {/* Wedding Collection */}
            <div>
              <h3 className="text-xl font-semibold text-[#082e21] text-center">
                Wedding Collection
              </h3>
              <p className="text-center text-gray-600 mt-3 leading-relaxed">
                Wedding Silk Sarees | Bridal Lehenga Sarees | Reception Sarees |  
                Heavy Work Sarees | Luxury Sarees
              </p>
              <div className="w-full h-[1px] bg-[#ecc153] mt-6"></div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default PopularSarees;