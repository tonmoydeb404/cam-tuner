import { FormSwitch } from "@/components/form";
import { useAppContext } from "@/context/app";
import useDebounce from "@/hooks/use-debounce";

type Props = {};

const Header = (props: Props) => {
  const { enable, setEnable } = useAppContext();

  const debouncedSetEnable = useDebounce((checked: boolean) => {
    setEnable(checked);
  }, 100);

  return (
    <div className="flex items-center justify-between mb-5">
      <h1 className="text-lg font-bold">Cam Tuner</h1>
      <FormSwitch
        checked={enable}
        onChange={debouncedSetEnable}
        id="enable"
        label={enable ? "Enabled" : "Disabled"}
        className="gap-1"
      />
    </div>
  );
};

export default Header;
