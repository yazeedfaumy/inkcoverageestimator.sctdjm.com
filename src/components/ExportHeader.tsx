import Logo from "@/assets/Logo.png";

interface ExportHeaderProps {
  fileName?: string;
  date?: string;
}

export function ExportHeader({ fileName, date }: ExportHeaderProps) {
  return (
    <div className="export-header p-6 border-b">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col md:flex-row md:items-center mb-4 md:mb-0">
          <img src={Logo} alt="Sterling Carter Technology Distributors" className="h-12 w-auto mb-2 md:mb-0" />
          <div className="md:ml-4">
            <h2 className="text-xl font-bold">Sterling Carter Technology Distributors</h2>
            <p className="text-sm text-gray-600 hidden md:block">22 Cargill Avenue, Kingston 10, Jamaica</p>
            <p className="text-sm text-gray-600 hidden md:block">Tel: 876-968-6637 • Email: info@sctdjm.com</p>
          </div>
        </div>
        <div className="text-sm text-gray-600">
          {fileName && <p>File: {fileName}</p>}
          {date && <p>Date: {date}</p>}
        </div>
      </div>
    </div>
  );
}