
import { useParams, Navigate } from "react-router-dom";

const EventRedirect = () => {
  const { id } = useParams<{ id: string }>();
  
  if (!id) {
    return <Navigate to="/events" replace />;
  }
  
  return <Navigate to={`/events/${id}`} replace />;
};

export default EventRedirect;
