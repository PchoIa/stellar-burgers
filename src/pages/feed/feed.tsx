import { useEffect, FC } from 'react';
import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { useAppDispatch, useAppSelector } from '../../services/store';
import { fetchFeed, selectOrders } from '../../services/slices/ordersSlice';

export const Feed: FC = () => {
  const dispatch = useAppDispatch();
  const { feed, loading } = useAppSelector(selectOrders);

  useEffect(() => {
    dispatch(fetchFeed());
  }, [dispatch]);

  if (loading && !feed.length) {
    return <Preloader />;
  }

  return <FeedUI orders={feed} handleGetFeeds={() => dispatch(fetchFeed())} />;
};
