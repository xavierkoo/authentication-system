type NotificationProps = {
  message: string;
  isError: boolean;
};

const Notifications = ({ message, isError }: NotificationProps) => {
  // if isError is true, use "alert-danger", otherwise use "alert-success" for the className
  const className = `alert ${
    isError ? "alert-danger" : "alert-success"
  } text-center my-${isError ? "3" : "2"} mx-auto w-75`;

  return (
    <div className={className} role="alert">
      {message}
    </div>
  );
};

export default Notifications;
