import clsx from "clsx"
import { AiOutlineLoading } from "react-icons/ai"

export const PageSpinner = ({ height = "h-[60vh]" }: { height?: string }) => {

    return (
        <div className={
            clsx(
                "flex items-center justify-center",
                height
            )
        }>
            <AiOutlineLoading className="text-3xl animate-spin infinite" />
        </div>
    )
}