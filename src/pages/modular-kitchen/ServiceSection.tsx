import { ReactNode } from "react";

type ServiceItem = {
  img: ReactNode;
  label: string;
};
const ServiceSection = ({title,service}:{title:string,service:ServiceItem[]}) => {

  return (
    <div className="p-6 py-20">
      <h2 className="text-center font-medium text-3xl mb-12">
        {title}
      </h2>
      <div className="flex md:flex-row flex-col justify-center items-center gap-20 p-12">
        {service.map((item, index) => (
          <div key={index} className="flex flex-col items-center gap-4">
            <div className="">{item.img}</div>
            <p>{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceSection;