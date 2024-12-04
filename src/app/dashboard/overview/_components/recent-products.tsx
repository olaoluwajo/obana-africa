import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const recentProducts = [
  {
    id: 1,
    name: 'White T-Shirt',
    status: true,
    qty: 25,
    price: 'N45.00'
  },
  {
    id: 2,
    name: 'Black T-Shirt',
    status: true,
    qty: 29,
    price: 'N25.00'
  },
  {
    id: 3,
    name: 'Blue T-Shirt',
    status: false,
    qty: 15,
    price: 'N36.99'
  },
  {
    id: 4,
    name: 'Red T-Shirt',
    status: true,
    qty: 32,
    price: 'N22.50'
  },
  {
    id: 5,
    name: 'Yellow T-Shirt',
    status: false,
    qty: 10,
    price: 'N15.20'
  }
];

const RecentProducts = () => {
  return (
    <Table>
      <TableCaption>A list of your recently uploaded products.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Product name</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Quantity</TableHead>
          <TableHead className="text-right">Price</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {recentProducts.map((product) => (
          <TableRow key={product.id}>
            <TableCell className="font-medium">{product.name}</TableCell>
            {/* <TableCell>{product.status ? 'Enabled' : 'Disabled'}</TableCell> */}
            <TableCell>
              <Badge variant={product.status ? 'outline' : 'default'}>
                {product.status ? 'Enabled' : 'Disabled'}
              </Badge>
            </TableCell>
            <TableCell>{product.qty}</TableCell>
            <TableCell className="text-right">{product.price}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default RecentProducts;
