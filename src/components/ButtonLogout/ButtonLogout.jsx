import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; 
import Button from "../Button/Button"; 

export default function LogoutButton() {
  const navigate = useNavigate();
  const { logout } = useAuth(); 

  const handleLogout = () => {
    // limpa estado e localStorage)
    logout();

    //Redireciona para home
    navigate("/");
  };

  return (
    <Button variant="danger" onClick={handleLogout}>
      Sair
    </Button>
  );
}