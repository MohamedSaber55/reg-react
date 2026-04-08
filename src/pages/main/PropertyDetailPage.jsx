import {useParams} from 'react-router-dom';
import PropertyDetailsClient from './PropertyDetailsClient';

export default function PropertyDetailPage() {
  const { id } = useParams();
  return <PropertyDetailsClient propertyId={id} />;
}
