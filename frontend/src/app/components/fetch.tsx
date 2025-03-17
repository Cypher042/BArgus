// "use client";
// import Image from "next/image";
// import { useEffect, useState } from "react";

// interface Product {
//   _id: string;
//   product_name: string;
//   product_url: string;
//   image_url: string;
//   price_history: { value: number; timestamp: string }[];
//   specifications: string[];
//   max_price: number;
//   min_price: number;
// }

// export default function FetchData() {
//   const [items, setItems] = useState<Product[]>([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const res = await fetch("/api/db");
//         const data = await res.json();
//         setItems(data.data);
//       } catch (err) {
//         console.error("Error Fetching data", err);
//       }
//     };
//     fetchData();
//   }, []);
//   console.log("Fetched Data:", items);


//   return (
//     <div className="">
//       {items.map((item) => (
//         <div key={item._id}>
//           <div>
//             <Image
//               src={item.image_url}
//               alt={item.product_name}
//               width={100}
//               height={100}
//             />
//             <div>
//               <strong>Product name : {item.product_name}</strong>
//             </div>
//           </div>
//           <div>
//             <a
//               href={item.product_url}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="text-blue-600 hover:text-blue-800 underline"
//             >
//               View on Amazon
//             </a>
//           </div>
//           <div className="">
//             <h3 className="font-semibold mb-2">Specifications</h3>
//             <ul className="list-disc list-inside space-y-2">
//               {item.specifications.map((spec, idx) => (
//                 <li key={idx}>{spec}</li>
//               ))}
//             </ul>
//           </div>

//           <div className="border-t p-6">
//             <h3 className="font-semibold mb-4">Price History</h3>
//             <div className="space-y-2">
//               {item.price_history.map((price, idx) => (
//                 <div key={idx} className="flex justify-between text-sm">
//                   <span>{new Date(price.timestamp).toLocaleDateString()}</span>
//                   <span className="font-semibold">
//                     ₹{price.value.toLocaleString()}
//                   </span>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }
