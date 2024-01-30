
type Props = {
  loading: boolean
}

const Loader = ({loading}: Props) => {

  return (
    <div className={`fixed top-0 left-0 w-full h-full flex items-center justify-center ${loading ? 'block' : 'hidden'}`}>
      <div className="absolute inset-0 bg-gray-800 opacity-50"></div>
      <div className="animate-spin rounded-full border-t-4 border-red-500 border-t-red-500 h-16 w-16 z-10"></div>
    </div>
  );
};

export default Loader;
