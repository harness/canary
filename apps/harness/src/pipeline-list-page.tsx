import { useParams } from "react-router-dom"

export function PipelineListPage() {
    const { "*": scope } = useParams()

    return <div>Pipelines in scope "{scope}"</div>
}