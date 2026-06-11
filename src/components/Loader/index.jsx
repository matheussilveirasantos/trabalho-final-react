import './Loader.css';

export default function Loader({ size = 'md', text = 'Carregando...' }) {
  return (
    <div className={`loader-wrapper loader-${size}`}>
      <div className="loader-spinner" />
      {text && <p className="loader-text">{text}</p>}
    </div>
  );
}