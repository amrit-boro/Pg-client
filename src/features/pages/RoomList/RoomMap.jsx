function RoomMap() {
  return (
    <div className="col-span-12 lg:col-span-4">
      {/* 🛑 CHANGE: Removed sticky and fixed height classes */}
      <div classNameName="top-24">
        <div className="w-full rounded-xl overflow-hidden shadow-sm bg-gray-300 border border-gray-200">
          <img
            // You might need to set an explicit height on the image if the
            // parent div doesn't have one and you want to control its size.
            className="w-full h-76 object-cover"
            src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&h=1000&fit=crop"
            alt="Map of Bangalore showing property locations"
          />
        </div>
      </div>
    </div>
  );
}

export default RoomMap;
