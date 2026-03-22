export const Aboutus = () => {
    return (
        <div className="bg-gray-50 py-16">
            <div className="container mx-auto px-6 lg:px-20">
                
                {/* Heading */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">
                        About Us
                    </h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Your trusted destination for high-quality electric stoves designed 
                        to make cooking easier, safer, and more efficient.
                    </p>
                </div>

                {/* Main Content */}
                <div className="grid md:grid-cols-2 gap-10 items-center mb-16">
                    
                    {/* Left Content */}
                    <div className="space-y-6 text-gray-700 leading-relaxed">
                        <p>
                            We are passionate about bringing modern kitchen solutions to every home. 
                            Our goal is to provide reliable, energy-efficient, and affordable electric 
                            stoves that fit the needs of today’s lifestyle.
                        </p>

                        <p>
                            Whether you are a student, a busy professional, or a family cook, 
                            we have the right product for you.
                        </p>

                        <p>
                            At our core, we focus on <span className="font-semibold text-black">quality, safety, and customer satisfaction</span>. 
                            Every product is carefully selected to ensure durability, performance, and ease of use.
                        </p>
                    </div>

                    {/* Right Card */}
                    <div className="bg-white shadow-lg rounded-2xl p-8 space-y-4">
                        <h2 className="text-2xl font-semibold text-gray-800">
                            Why Choose Us?
                        </h2>
                        <ul className="space-y-3 text-gray-600">
                            <li>✔ High-quality and trusted products</li>
                            <li>✔ Affordable pricing</li>
                            <li>✔ Fast and secure delivery</li>
                            <li>✔ Easy online shopping experience</li>
                            <li>✔ Dedicated customer support</li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="bg-white rounded-2xl shadow-md p-8 text-center max-w-3xl mx-auto">
                    <p className="text-gray-700 leading-relaxed">
                        We believe that cooking should be simple and enjoyable. That’s why we 
                        not only sell products but also provide a smooth shopping experience, 
                        fast delivery, and reliable customer support.
                    </p>

                    <p className="mt-4 font-semibold text-gray-800">
                        Our mission is to make modern cooking accessible to everyone.
                    </p>
                </div>

            </div>
        </div>
    );
};