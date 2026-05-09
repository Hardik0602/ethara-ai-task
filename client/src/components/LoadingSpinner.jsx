import { TailSpin } from 'react-loader-spinner'
const LoadingSpinner = () => {
    return (
        <div className='flex w-full min-h-screen items-center justify-center'>
            <TailSpin
                visible={true}
                height='100'
                width='100'
                color='#6a7282'
                ariaLabel='tail-spin-loading'
                radius='1' />
        </div>
    )
}
export default LoadingSpinner