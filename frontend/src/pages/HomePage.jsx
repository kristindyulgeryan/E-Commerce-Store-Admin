const categories = [
  { href: "/bracelet", name: "Bracelets", imageUrl: "/bracelet-2.jpg" },
  { href: "/chain", name: "Chains", imageUrl: "/chain-2.jpg" },
  { href: "/earrings", name: "Earrings", imageUrl: "/earrings-1.jpg" },
  { href: "/pendant", name: "Pendants", imageUrl: "/pendant-2.jpg" },
  { href: "/ring", name: "Rings", imageUrl: "/ring-1.jpg" },
];

const HomePage = () => {
  return (
    <div className="relative min-h-screen text-white overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-center text-5xl sm:text-6xl font-bold text-yellow-600 mb-4">
          Explore Our Categories
        </h1>
        <p className="text-center text-xl text-gray-300 mb-12">
          Discover the latest trends on jewelry fashion
        </p>
      </div>
    </div>
  );
};

export default HomePage;
