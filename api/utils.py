from rest_framework.response import Response
from rest_framework import status


class ResponseFormatter:
    @staticmethod
    def success(
        data=None, message="Operation successful", status_code=status.HTTP_200_OK
    ):
        return Response(
            {"errors": None, "message": message, "data": data},
            status=status_code,
        )

    @staticmethod
    def error(message, status_code=status.HTTP_400_BAD_REQUEST, errors=None):
        return Response(
            {"errors": errors, "message": message, "data": None},
            status=status_code,
        )
