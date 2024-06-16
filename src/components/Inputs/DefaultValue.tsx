import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

type PageProps = {
  data: any;
};

export default function DefaultValue({ data }: PageProps) {
  const id = ["65db2341bd7efa65c603577c", "65db16c8bd7efa65c6035779"];
  const filteredData = data.filter((item: any) => id.includes(item.id));
  const filterString = filteredData.map((data: any) => {
    name: data.name;
    id: data.id;
  });
  return (
    <FormField
      name=""
      render={({ field }) => (
        <FormItem>
          <FormLabel>Old Extras</FormLabel>
          <FormControl>
            <Input disabled placeholder={filterString} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
