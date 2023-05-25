import { Injectable, OnDestroy } from '@angular/core';
import { BaseHttpService } from '../../../services/base.http.service';
import { Observable } from 'rxjs';
import { HttpParams, HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { GetSupplierOrderResponse } from '../commands/responses/get.supplierorder.response';
import { GetSupplierOrderRequest } from '../commands/requests/get.supplierorder.request';
import { PutSupplierOrderResponse } from '../commands/responses/put.supplierorder.response';
import { PutSupplierOrderRequest } from '../commands/requests/put.supplierorder.request';
import { PostSupplierOrderResponse } from '../commands/responses/post.supplierorder.response';
import { PostSupplierOrderRequest } from '../commands/requests/post.supplierorder.request';
import { DeleteSupplierOrderRequest } from '../commands/requests/delete.supplierorder.request';
import { DeleteSupplierOrderResponse } from '../commands/responses/delete.supplierorder.response';
import { DeleteSupplierOrderPositionResponse } from '../commands/responses/delete.supplierorder.position.response';
import { DeleteSupplierOrderPositionRequest } from '../commands/requests/delete.supplierorder.position.request';
import { PostSupplierOrderPositionRequest } from '../commands/requests/post.supplierorder.position.request';
import { PostSupplierOrderPositionResponse } from '../commands/responses/post.supplierorder.position.response';
import { PutSupplierOrderPositionResponse } from '../commands/responses/put.supplierorder.position.response';
import { PutSupplierOrderPositionRequest } from '../commands/requests/put.supplierorder.position.request';
import { GetSupplierOrderPositionResponse } from '../commands/responses/get.supplierorder.position.response';
import { GetSupplierOrderPositionRequest } from '../commands/requests/get.supplierorder.position.request';
import { PostSupplierOrderCancelRequest } from '../commands/requests/post.supplierorder.cancel.request';
import { PostSupplierOrderCancelResponse } from '../commands/responses/post.supplierorder.cancel.response';
import { PostSupplierOrderConfirmResponse } from '../commands/responses/post.supplierorder.confirm.response';
import { PostSupplierOrderConfirmRequest } from '../commands/requests/post.supplierorder.confirm.request';
import { PostSupplierOrderCopyRequest } from '../commands/requests/post.supplierorder.copy.request';
import { PostSupplierOrderCopyResponse } from '../commands/responses/post.supplierorder.copy.response';
import { PostSupplierOrderOpenResponse } from '../commands/responses/post.supplierorder.open.response';
import { PostSupplierOrderOpenRequest } from '../commands/requests/post.supplierorder.open.request';
import { GetSupplierOrderSummaryRequest } from '../commands/requests/get.supplierorder.summary.request';
import { GetSupplierOrderSummaryResponse } from '../commands/responses/get.supplierorder.summary.response';
import { GetCooperationOrderRequest } from '../commands/requests/get.cooperation.order.request';
import { GetCooperationOrderResponse } from '../commands/responses/get.cooperation.order.response';
import { PutCooperationOrderRequest } from '../commands/requests/put.cooperation.order.request';
import { PutCooperationOrderResponse } from '../commands/responses/put.cooperation.order.response';
import { PostCooperationOrderRequest } from '../commands/requests/post.cooperation.order.request';
import { PostCooperationOrderResponse } from '../commands/responses/post.cooperation.order.response';
import { DeleteCooperationOrderRequest } from '../commands/requests/delete.cooperation.order.request';
import { DeleteCooperationOrderResponse } from '../commands/responses/delete.cooperation.order.response';
import { GetCooperationOrderPositionRequest } from '../commands/requests/get.cooperation.order.position.request';
import { GetCooperationOrderPositionResponse } from '../commands/responses/get.cooperation.order.position.response';
import { PutCooperationOrderPositionRequest } from '../commands/requests/put.cooperation.order.position.request';
import { PutCooperationOrderPositionResponse } from '../commands/responses/put.cooperation.order.position.response';
import { PostCooperationOrderPositionRequest } from '../commands/requests/post.cooperation.order.position.request';
import { PostCooperationOrderPositionResponse } from '../commands/responses/post.cooperation.order.position.response';
import { DeleteCooperationOrderPositionRequest } from '../commands/requests/delete.cooperation.order.position.request';
import { DeleteCooperationOrderPositionResponse } from '../commands/responses/delete.cooperation.order.position.response';
import { GetCooperationOrderSummaryRequest } from '../commands/requests/get.cooperation.order.summary.request';
import { GetCooperationOrderSummaryResponse } from '../commands/responses/get.cooperation.order.summary.response';
import { PostCooperationOrderPositionsResponse } from '../commands/responses/post.cooperation.order.positions.response';
import { PostCooperationOrderPositionsRequest } from '../commands/requests/post.cooperation.order.positions.request';
import { PostCooperationOrderCancelRequest } from '../commands/requests/post.cooperation.order.cancel.request';
import { PostCooperationOrderConfirmRequest } from '../commands/requests/post.cooperation.order.confirm.request';
import { PostCooperationOrderCopyRequest } from '../commands/requests/post.cooperation.order.copy.request';
import { PostCooperationOrderOpenRequest } from '../commands/requests/post.cooperation.order.open.request';
import { PostCooperationOrderCancelResponse } from '../commands/responses/post.cooperation.order.cancel.response';
import { PostCooperationOrderConfirmResponse } from '../commands/responses/post.cooperation.order.confirm.response';
import { PostCooperationOrderCopyResponse } from '../commands/responses/post.cooperation.order.copy.response';
import { PostCooperationOrderOpenResponse } from '../commands/responses/post.cooperation.order.open.response';
import { GetCooperationOrderAvailableWorkOrderOperationsRequest } from '../commands/requests/get.cooperation.order.available.workorder.operations.request';
import { GetWorkOrderOperationViewResponse } from '../../Truster.Core.UI.Manufacturing/commands/responses/get.workorder.operation.view.response';
import { GetCooperationOrderWorkOrderOperationsResponse } from '../commands/responses/get.cooperation.order.available.workorder.operations.response';
import { GetCooperationOrderIssuePositionRequest } from '../commands/requests/get.cooperation.order.issue.position.request';
import { GetCooperationOrderIssuePositionResponse } from '../commands/responses/get.cooperation.order.issue.position.response';
import { PostCooperationOrderIssueConfirmRequest } from '../commands/requests/post.cooperation.order.issue.confirm.request';
import { GetCooperationIssueRequest } from '../commands/requests/get.cooperation.issue.request';
import { GetCooperationIssueResponse } from '../commands/responses/get.cooperation.issue.response';
import { GetCooperationTakeoverRequest } from '../commands/requests/get.cooperation.takeover.request';
import { GetCooperationTakeoverResponse } from '../commands/responses/get.cooperation.takeover.response';
import { GetCooperationOrderTakeoverPositionRequest } from '../commands/requests/get.cooperation.order.takeover.position.request';
import { PostCooperationOrderTakeoverConfirmRequest } from '../commands/requests/post.cooperation.order.takeover.confirm.request';
import { GetCooperationOrderTakeoverPositionResponse } from '../commands/responses/get.cooperation.order.takeover.position.response';
import { PostCooperationOrderTakeoverResponse } from '../commands/responses/post.cooperation.order.takeover.response';
import { PostCooperationOrderIssueResponse } from '../commands/responses/post.cooperation.order.issue.response';
import { GetCooperationTakeoverPositionRequest } from '../commands/requests/get.cooperation.takeover.position.request';
import { GetCooperationTakeoverPositionResponse } from '../commands/responses/get.cooperation.takeover.position.response';
import { GetCooperationIssuePositionRequest } from '../commands/requests/get.cooperation.issue.position.request';
import { GetCooperationIssuePositionResponse } from '../commands/responses/get.cooperation.issue.position.response';
import { PostCooperationOrderRecalculatePriceResponse } from '../commands/responses/post.cooperation.order.recalculate.price.response';
import { PostCooperationOrderRecalculatePriceRequest } from '../commands/requests/post.cooperation.order.recalculate.price.request';
import { GetSupplierOrderAnalyticalRequest } from '../commands/requests/get.supplierorderanalytical.request';
import { GetWarehouseTakeoverRequest } from '../commands/requests/get.warehouse.takeover.request';
import { GetWarehouseTakeoverResponse } from '../commands/responses/get.warehouse.takeover.response';
import { PostWarehouseTakeoverRequest } from '../commands/requests/post.warehousetakeover.request';
import { PostWarehouseTakeoverResponse } from '../commands/responses/post.warehousetakeover.response';
import { PutWarehouseTakeoverRequest } from '../commands/requests/put.warehousetakeover.request';
import { PutWarehouseTakeoverResponse } from '../commands/responses/put.warehousetakeover.response';
import { DeleteWarehouseTakeoverRequest } from '../commands/requests/delete.warehousetakeover.request';
import { DeleteWarehouseTakeoverResponse } from '../commands/responses/delete.warehousetakeover.response';
import { GetWarehouseTakeoverPositionsRequest } from '../commands/requests/get.warehousetakeover.position.request';
import { GetWarehouseTakeoverPositionsResponse } from '../commands/responses/get.warehousetakeover.position.response';
import { PostWarehouseTakeoverPositionRequest } from '../commands/requests/post.warehouse.takeover.position.request';
import { PostWarehouseTakeoverPositionResponse } from '../commands/responses/post.warehouse.takeover.position.response';
import { DeleteWarehouseTakeoverPositionRequest } from '../commands/requests/delete.warehouse.takeover.position.request';
import { DeleteWarehouseTakeoverPositionResponse } from '../commands/responses/delete.warehouse.takeover.position.response';
import { PutWarehouseTakeoverPositionRequest } from '../commands/requests/put.warehousetakeover.position.request';
import { PutWarehouseTakeoverPositionResponse } from '../commands/responses/put.warehousetakeover.position.response';
import { PostCooperationOrderCloseRequest } from '../commands/requests/post.cooperation.order.close.request';
import { PostCooperationOrderCloseResponse } from '../commands/responses/post.cooperation.order.close.response';
import { PostWarehouseTakeoverPositionsRequest } from '../commands/requests/post.warehouse.takeover.positions.request';
import { PostWarehouseTakeoverPositionsResponse } from '../commands/responses/post.warehouse.takeover.positions.response';
import { GetSupplierOrderPositionInternalRequest } from '../commands/requests/get.supplierorder.position.internal.request';
import { GetSupplierOrderPositionInternalResponse } from '../commands/responses/get.supplierorder.position.internal.response';
import { GetCooperationOrderReportRequest } from '../commands/requests/get.cooperation.order.report.request';
import { GetCooperationOrderReportResponse } from '../commands/responses/get.cooperation.order.report.response';
import { GetCooperationOrderAnalyticsRequest } from '../commands/requests/get.cooperation.order.analytics.request';
import { GetCooperationOrderAnalyticsResponse } from '../commands/responses/get.cooperation.order.analytics.response';
import { PostSupplierOrderCloseRequest } from '../commands/requests/post.supplierorder.close.request';
import { PostSupplierOrderCloseResponse } from '../commands/responses/post.supplierorder.close.response';
import { PostCooperationOrderTakeoverCancelRequest } from '../commands/requests/post.cooperation.order.takeover.cancel.request';
import { PostCooperationOrderTakeoverCancelResponse } from '../commands/responses/post.cooperation.order.takeover.cancel.response';
import { PostCooperationOrderTakeoverPositionCancelResponse } from '../commands/responses/post.cooperation.order.takeover.position.cancel.response';
import { PostCooperationOrderTakeoverPositionCancelRequest } from '../commands/requests/post.cooperation.order.takeover.position.cancel.request';
import { PostCooperationOrderIssueCancelRequest } from '../commands/requests/post.cooperation.order.issue.cancel.request';
import { PostCooperationOrderIssuePositionCancelRequest } from '../commands/requests/post.cooperation.order.issue.position.cancel.request';
import { PostCooperationOrderIssueCancelResponse } from '../commands/responses/post.cooperation.order.issue.cancel.response';
import { PostCooperationOrderIssuePositionCancelResponse } from '../commands/responses/post.cooperation.order.issue.position.cancel.response';
import { GetCooperationOrderPositionsRequest } from '../commands/requests/get.cooperation.order.positions.request';
import { GetCooperationOrderPositionsResponse } from '../commands/responses/get.cooperation.order.positions.response';


@Injectable()
export class ProcurementService extends BaseHttpService {
    //we inject the http service to constructor
    constructor(private http: HttpClient) {
        super();
    }

    /* SUPPLIER ORDER START */
    getSupplierOrder(getSupplierOrderRequest: GetSupplierOrderRequest): Observable<GetSupplierOrderResponse> {
        let httpParams: HttpParams = this.toHttpParams(getSupplierOrderRequest);

        return this.http.get<GetSupplierOrderResponse>(this._SERVER_URL + '/api/SupplierOrder', { params: httpParams }).pipe(
            tap((response: GetSupplierOrderResponse) => {
                return response;
            })
        );
    }

    updateSupplierOrder(putSupplierOrderRequest: PutSupplierOrderRequest): Observable<PutSupplierOrderResponse> {
        return this.http.put<PutSupplierOrderResponse>(this._SERVER_URL + '/api/SupplierOrder/' + putSupplierOrderRequest.supplierOrderId, putSupplierOrderRequest).pipe(
            tap((response: PutSupplierOrderResponse) => {
                return response;
            })
        );
    }

    createSupplierOrder(postSupplierOrderRequest: PostSupplierOrderRequest): Observable<PostSupplierOrderResponse> {
        return this.http.post<PostSupplierOrderResponse>(this._SERVER_URL + '/api/SupplierOrder', postSupplierOrderRequest).pipe(
            tap((response: PostSupplierOrderResponse) => {
                return response;
            })
        );
    }

    deleteSupplierOrder(deleteSupplierOrderRequest: DeleteSupplierOrderRequest): Observable<DeleteSupplierOrderResponse> {
        return this.http.delete<DeleteSupplierOrderResponse>(this._SERVER_URL + '/api/SupplierOrder/' + deleteSupplierOrderRequest.supplierOrderId).pipe(
            tap((response: DeleteSupplierOrderResponse) => {
                return response;
            })
        );
    }

    cancelSupplierOrder(postSupplierOrderCancelRequest: PostSupplierOrderCancelRequest): Observable<PostSupplierOrderCancelResponse> {
        return this.http.post<PostSupplierOrderCancelResponse>(this._SERVER_URL + '/api/SupplierOrder/' + postSupplierOrderCancelRequest.supplierOrderId + '/Cancel', postSupplierOrderCancelRequest).pipe(
            tap((response: PostSupplierOrderCancelResponse) => {
                return response;
            })
        );
    }

    confirmSupplierOrder(postSupplierOrderConfirmRequest: PostSupplierOrderConfirmRequest): Observable<PostSupplierOrderConfirmResponse> {
        return this.http.post<PostSupplierOrderConfirmResponse>(this._SERVER_URL + '/api/SupplierOrder/' + postSupplierOrderConfirmRequest.supplierOrderId + '/Confirm', postSupplierOrderConfirmRequest).pipe(
            tap((response: PostSupplierOrderConfirmResponse) => {
                return response;
            })
        );
    }

    closeSupplierOrder(postSupplierOrderCloseRequest: PostSupplierOrderCloseRequest): Observable<PostSupplierOrderCloseResponse> {
        return this.http.post<PostSupplierOrderCloseResponse>(this._SERVER_URL + '/api/SupplierOrder/' + postSupplierOrderCloseRequest.supplierOrderId + '/Close', postSupplierOrderCloseRequest).pipe(
            tap((response: PostSupplierOrderCloseResponse) => {
                return response;
            })
        );
    }

    copySupplierOrder(postSupplierOrderCopyRequest: PostSupplierOrderCopyRequest): Observable<PostSupplierOrderCopyResponse> {
        return this.http.post<PostSupplierOrderCopyResponse>(this._SERVER_URL + '/api/SupplierOrder/' + postSupplierOrderCopyRequest.supplierOrderId + '/Copy', postSupplierOrderCopyRequest).pipe(
            tap((response: PostSupplierOrderCopyResponse) => {
                return response;
            })
        );
    }

    openSupplierOrder(postSupplierOrderOpenRequest: PostSupplierOrderOpenRequest): Observable<PostSupplierOrderOpenResponse> {
        return this.http.post<PostSupplierOrderOpenResponse>(this._SERVER_URL + '/api/SupplierOrder/' + postSupplierOrderOpenRequest.supplierOrderId + '/Open', postSupplierOrderOpenRequest).pipe(
            tap((response: PostSupplierOrderOpenResponse) => {
                return response;
            })
        );
    }

    getSupplierOrderAnalytical(getSupplierOrderAnalyticalRequest: GetSupplierOrderAnalyticalRequest): Observable<GetSupplierOrderResponse> {
        let httpParams: HttpParams = this.toHttpParams(getSupplierOrderAnalyticalRequest);

        return this.http.get<GetSupplierOrderResponse>(this._SERVER_URL + '/api/SupplierOrder/Analytical', { params: httpParams }).pipe(
            tap((response: GetSupplierOrderResponse) => {
                return response;
            })
        );
    }


    /* SUPPLIER ORDER END */

    /* SUPPLIER ORDER POSITION START */
    getSupplierOrderPosition(getSupplierOrderPositionRequest: GetSupplierOrderPositionRequest): Observable<GetSupplierOrderPositionResponse> {
        let httpParams: HttpParams = this.toHttpParams(getSupplierOrderPositionRequest);

        return this.http.get<GetSupplierOrderPositionResponse>(this._SERVER_URL + '/api/SupplierOrder/' + getSupplierOrderPositionRequest.supplierOrderId + '/Position', { params: httpParams }).pipe(
            tap((response: GetSupplierOrderPositionResponse) => {
                return response;
            })
        );
    }

    updateSupplierOrderPosition(putSupplierOrderPositionRequest: PutSupplierOrderPositionRequest): Observable<PutSupplierOrderPositionResponse> {
        return this.http.put<PutSupplierOrderPositionResponse>(this._SERVER_URL + '/api/SupplierOrder/Position/' + putSupplierOrderPositionRequest.supplierOrderPositionId, putSupplierOrderPositionRequest).pipe(
            tap((response: PutSupplierOrderPositionResponse) => {
                return response;
            })
        );
    }

    createSupplierOrderPosition(postSupplierOrderPositionRequest: PostSupplierOrderPositionRequest): Observable<PostSupplierOrderPositionResponse> {
        return this.http.post<PostSupplierOrderPositionResponse>(this._SERVER_URL + '/api/SupplierOrder/' + postSupplierOrderPositionRequest.supplierOrderId + '/Position', postSupplierOrderPositionRequest).pipe(
            tap((response: PostSupplierOrderPositionResponse) => {
                return response;
            })
        );
    }

    deleteSupplierOrderPosition(deleteSupplierOrderPositionRequest: DeleteSupplierOrderPositionRequest): Observable<DeleteSupplierOrderPositionResponse> {
        return this.http.delete<DeleteSupplierOrderPositionResponse>(this._SERVER_URL + '/api/SupplierOrder/Position/' + deleteSupplierOrderPositionRequest.supplierOrderPositionId).pipe(
            tap((response: DeleteSupplierOrderPositionResponse) => {
                return response;
            })
        );
    }

    getSupplierOrderSummary(getSupplierOrderSummaryRequest: GetSupplierOrderSummaryRequest): Observable<GetSupplierOrderSummaryResponse> {
        let httpParams: HttpParams = this.toHttpParams(getSupplierOrderSummaryRequest);

        return this.http.get<GetSupplierOrderSummaryResponse>(this._SERVER_URL + '/api/SupplierOrder/Summary/' + getSupplierOrderSummaryRequest.supplierOrderId, { params: httpParams }).pipe(
            tap((response: GetSupplierOrderSummaryResponse) => {
                return response;
            })
        );
    }

    /* SUPPLIER ORDER POSITION END */

    /* COOPERATION ORDER START */

    getCooperationOrder(getCooperationOrderRequest: GetCooperationOrderRequest): Observable<GetCooperationOrderResponse> {
        let httpParams: HttpParams = this.toHttpParams(getCooperationOrderRequest);

        return this.http.get<GetCooperationOrderResponse>(this._SERVER_URL + '/api/Cooperation/CooperationOrder', { params: httpParams }).pipe(
            tap((response: GetCooperationOrderResponse) => {
                return response;
            })
        );
    }

    updateCooperationOrder(putCooperationOrderRequest: PutCooperationOrderRequest): Observable<PutCooperationOrderResponse> {
        return this.http.put<PutCooperationOrderResponse>(this._SERVER_URL + '/api/Cooperation/CooperationOrder/' + putCooperationOrderRequest.cooperationOrderId, putCooperationOrderRequest).pipe(
            tap((response: PutCooperationOrderResponse) => {
                return response;
            })
        );
    }

    createCooperationOrder(postCooperationOrderRequest: PostCooperationOrderRequest): Observable<PostCooperationOrderResponse> {
        return this.http.post<PostCooperationOrderResponse>(this._SERVER_URL + '/api/Cooperation/CooperationOrder', postCooperationOrderRequest).pipe(
            tap((response: PostCooperationOrderResponse) => {
                return response;
            })
        );
    }

    deleteCooperationOrder(deleteCooperationOrderRequest: DeleteCooperationOrderRequest): Observable<DeleteCooperationOrderResponse> {
        return this.http.delete<DeleteCooperationOrderResponse>(this._SERVER_URL + '/api/Cooperation/CooperationOrder/' + deleteCooperationOrderRequest.cooperationOrderId).pipe(
            tap((response: DeleteCooperationOrderResponse) => {
                return response;
            })
        );
    }

    getCooperationOrderSummary(getCooperationOrderSummaryRequest: GetCooperationOrderSummaryRequest): Observable<GetCooperationOrderSummaryResponse> {
        let httpParams: HttpParams = this.toHttpParams(getCooperationOrderSummaryRequest);

        return this.http.get<GetCooperationOrderSummaryResponse>(this._SERVER_URL + '/api/Cooperation/CooperationOrder/Summary/' + getCooperationOrderSummaryRequest.cooperationOrderId, { params: httpParams }).pipe(
            tap((response: GetCooperationOrderSummaryResponse) => {
                return response;
            })
        );
    }

    cancelCooperationOrder(postCooperationOrderCancelRequest: PostCooperationOrderCancelRequest): Observable<PostCooperationOrderCancelResponse> {
        return this.http.post<PostCooperationOrderCancelResponse>(this._SERVER_URL + '/api/Cooperation/CooperationOrder/' + postCooperationOrderCancelRequest.cooperationOrderId + '/Cancel', postCooperationOrderCancelRequest).pipe(
            tap((response: PostCooperationOrderCancelResponse) => {
                return response;
            })
        );
    }

    confirmCooperationOrder(postCooperationOrderConfirmRequest: PostCooperationOrderConfirmRequest): Observable<PostCooperationOrderConfirmResponse> {
        return this.http.post<PostCooperationOrderConfirmResponse>(this._SERVER_URL + '/api/Cooperation/CooperationOrder/' + postCooperationOrderConfirmRequest.cooperationOrderId + '/Confirm', postCooperationOrderConfirmRequest).pipe(
            tap((response: PostCooperationOrderConfirmResponse) => {
                return response;
            })
        );
    }

    copyCooperationOrder(postCooperationOrderCopyRequest: PostCooperationOrderCopyRequest): Observable<PostCooperationOrderCopyResponse> {
        return this.http.post<PostCooperationOrderCopyResponse>(this._SERVER_URL + '/api/Cooperation/CooperationOrder/' + postCooperationOrderCopyRequest.cooperationOrderId + '/Copy', postCooperationOrderCopyRequest).pipe(
            tap((response: PostCooperationOrderCopyResponse) => {
                return response;
            })
        );
    }

    openCooperationOrder(postCooperationOrderOpenRequest: PostCooperationOrderOpenRequest): Observable<PostCooperationOrderOpenResponse> {
        return this.http.post<PostCooperationOrderOpenResponse>(this._SERVER_URL + '/api/Cooperation/CooperationOrder/' + postCooperationOrderOpenRequest.cooperationOrderId + '/Open', postCooperationOrderOpenRequest).pipe(
            tap((response: PostCooperationOrderOpenResponse) => {
                return response;
            })
        );
    }

    closeCooperationOrder(postCooperationOrderCloseRequest: PostCooperationOrderCloseRequest): Observable<PostCooperationOrderCloseResponse> {
        return this.http.post<PostCooperationOrderCloseResponse>(this._SERVER_URL + '/api/Cooperation/CooperationOrder/' + postCooperationOrderCloseRequest.cooperationOrderId + '/Complete', postCooperationOrderCloseRequest).pipe(
            tap((response: PostCooperationOrderCloseResponse) => {
                return response;
            })
        );
    }

    recalcualteCooperationOrderPrice(postCooperationOrderRecalculatePriceRequest: PostCooperationOrderRecalculatePriceRequest): Observable<PostCooperationOrderRecalculatePriceResponse> {
        return this.http.post<PostCooperationOrderRecalculatePriceResponse>(this._SERVER_URL + '/api/Cooperation/CooperationOrder/' + postCooperationOrderRecalculatePriceRequest.cooperationOrderId + '/RecalcualtePrice', postCooperationOrderRecalculatePriceRequest).pipe(
            tap((response: PostCooperationOrderRecalculatePriceResponse) => {
                return response;
            })
        );
    }

    getCooperationOrderReport(getCooperationOrderReportRequest: GetCooperationOrderReportRequest): Observable<GetCooperationOrderReportResponse> {
        let httpParams: HttpParams = this.toHttpParams(getCooperationOrderReportRequest);

        return this.http.get<GetCooperationOrderReportResponse>(this._SERVER_URL + '/api/Cooperation/CooperationOrder/Report', { params: httpParams }).pipe(
            tap((response: GetCooperationOrderReportResponse) => {
                return response;
            })
        );
    }

    /* COOPERATION ORDER END */

    /* COOPERATION ORDER POSITION START */

    getCooperationOrderPositions(getCooperationOrderPositionRequest: GetCooperationOrderPositionRequest): Observable<GetCooperationOrderPositionResponse> {
        let httpParams: HttpParams = this.toHttpParams(getCooperationOrderPositionRequest);

        return this.http.get<GetCooperationOrderPositionResponse>(this._SERVER_URL + '/api/Cooperation/CooperationOrder/' + getCooperationOrderPositionRequest.cooperationOrderId + '/Position', { params: httpParams }).pipe(
            tap((response: GetCooperationOrderPositionResponse) => {
                return response;
            })
        );
    }

    getCooperationOrderAllPositions(getCooperationOrderPositionsRequest: GetCooperationOrderPositionsRequest): Observable<GetCooperationOrderPositionsResponse> {
        let httpParams: HttpParams = this.toHttpParams(getCooperationOrderPositionsRequest);

        return this.http.get<GetCooperationOrderPositionsResponse>(this._SERVER_URL + '/api/Cooperation/CooperationOrder/Positions', { params: httpParams }).pipe(
            tap((response: GetCooperationOrderPositionsResponse) => {
                return response;
            })
        );
    }

    updateCooperationOrderPosition(putCooperationOrderPositionRequest: PutCooperationOrderPositionRequest): Observable<PutCooperationOrderPositionResponse> {
        return this.http.put<PutCooperationOrderPositionResponse>(this._SERVER_URL + '/api/Cooperation/CooperationOrder/Position/' + putCooperationOrderPositionRequest.cooperationOrderPositionId, putCooperationOrderPositionRequest).pipe(
            tap((response: PutCooperationOrderPositionResponse) => {
                return response;
            })
        );
    }

    createCooperationOrderPosition(postCooperationOrderPositionRequest: PostCooperationOrderPositionRequest): Observable<PostCooperationOrderPositionResponse> {
        return this.http.post<PostCooperationOrderPositionResponse>(this._SERVER_URL + '/api/Cooperation/CooperationOrder/' + postCooperationOrderPositionRequest.cooperationOrderId + '/Position', postCooperationOrderPositionRequest).pipe(
            tap((response: PostCooperationOrderPositionResponse) => {
                return response;
            })
        );
    }

    createCooperationOrderPositions(postCooperationOrderPositionsRequest: PostCooperationOrderPositionsRequest): Observable<PostCooperationOrderPositionsResponse> {
        return this.http.post<PostCooperationOrderPositionsResponse>(this._SERVER_URL + '/api/Cooperation/CooperationOrder/' + postCooperationOrderPositionsRequest.cooperationOrderId + '/Positions', postCooperationOrderPositionsRequest).pipe(
            tap((response: PostCooperationOrderPositionsResponse) => {
                return response;
            })
        );
    }

    deleteCooperationOrderPosition(deleteCooperationOrderPositionRequest: DeleteCooperationOrderPositionRequest): Observable<DeleteCooperationOrderPositionResponse> {
        return this.http.delete<DeleteCooperationOrderPositionResponse>(this._SERVER_URL + '/api/Cooperation/CooperationOrder/Position/' + deleteCooperationOrderPositionRequest.cooperationOrderPositionId).pipe(
            tap((response: DeleteCooperationOrderPositionResponse) => {
                return response;
            })
        );
    }

    getAvailableCooperationWorkOrderOperations(PostCooperationOrderAvailableWorkOrderOperationsRequest: GetCooperationOrderAvailableWorkOrderOperationsRequest): Observable<GetCooperationOrderWorkOrderOperationsResponse> {
        let httpParams: HttpParams = this.toHttpParams(PostCooperationOrderAvailableWorkOrderOperationsRequest);

        return this.http.get<GetCooperationOrderWorkOrderOperationsResponse>(this._SERVER_URL + '/api/Cooperation/CooperationOrder/Position/WorkOrderOperation/View', { params: httpParams }).pipe(
            tap((response: GetCooperationOrderWorkOrderOperationsResponse) => {
                return response;
            })
        );
    }

    getCooperationOrderAnalytics(getCooperationOrderAnalyticsRequest: GetCooperationOrderAnalyticsRequest): Observable<GetCooperationOrderAnalyticsResponse> {
        let httpParams: HttpParams = this.toHttpParams(getCooperationOrderAnalyticsRequest);

        return this.http.get<GetCooperationOrderAnalyticsResponse>(this._SERVER_URL + '/api/Cooperation/CooperationOrder/Analytics', { params: httpParams }).pipe(
            tap((response: GetCooperationOrderAnalyticsResponse) => {
                return response;
            })
        );
    }

    /* COOPERATION ORDER POSITION END */

    /* COOPERATION ISSUES */

    getCooperationOrderIssuePositions(getCooperationOrderIssuePositionRequest: GetCooperationOrderIssuePositionRequest): Observable<GetCooperationOrderIssuePositionResponse> {
        let httpParams: HttpParams = this.toHttpParams(getCooperationOrderIssuePositionRequest);

        return this.http.get<GetCooperationOrderIssuePositionResponse>(this._SERVER_URL + '/api/Cooperation/CooperationOrder/' + getCooperationOrderIssuePositionRequest.cooperationOrderId + '/Issue/Positions', { params: httpParams }).pipe(
            tap((response: GetCooperationOrderIssuePositionResponse) => {
                return response;
            })
        );
    }

    confirmCooperationOrderIssue(postCooperationOrderIssueConfirmRequest: PostCooperationOrderIssueConfirmRequest): Observable<PostCooperationOrderIssueResponse> {

        return this.http.post<PostCooperationOrderIssueResponse>(this._SERVER_URL + '/api/Cooperation/CooperationOrder/' + postCooperationOrderIssueConfirmRequest.cooperationOrderId + '/Issue', postCooperationOrderIssueConfirmRequest).pipe(
            tap((response: PostCooperationOrderIssueResponse) => {
                return response;
            })
        );
    }

    getCooperationIssues(getCooperationIssueRequest: GetCooperationIssueRequest): Observable<GetCooperationIssueResponse> {
        let httpParams: HttpParams = this.toHttpParams(getCooperationIssueRequest);

        return this.http.get<GetCooperationIssueResponse>(this._SERVER_URL + '/api/Cooperation/CooperationIssue/' + getCooperationIssueRequest.cooperationOrderId, { params: httpParams }).pipe(
            tap((response: GetCooperationIssueResponse) => {
                return response;
            })
        );
    }

    getCooperationIssuePositions(getCooperationIssuePositionRequest: GetCooperationIssuePositionRequest): Observable<GetCooperationIssuePositionResponse> {
        let httpParams: HttpParams = this.toHttpParams(getCooperationIssuePositionRequest);

        return this.http.get<GetCooperationIssuePositionResponse>(this._SERVER_URL + '/api/Cooperation/CooperationIssue/' + getCooperationIssuePositionRequest.cooperationIssueId + '/Position', { params: httpParams }).pipe(
            tap((response: GetCooperationIssuePositionResponse) => {
                return response;
            })
        );
    }

    cancelCooperationOrderIssue(postCooperationOrderIssueCancelRequest: PostCooperationOrderIssueCancelRequest): Observable<PostCooperationOrderIssueCancelResponse> {

        return this.http.post<PostCooperationOrderIssueCancelResponse>(this._SERVER_URL + '/api/Cooperation/CooperationIssue/' + postCooperationOrderIssueCancelRequest.cooperationIssueId + '/Cancel', postCooperationOrderIssueCancelRequest).pipe(
            tap((response: PostCooperationOrderIssueCancelResponse) => {
                return response;
            })
        );
    }

    cancelCooperationOrderIssuePosition(postCooperationOrderIssuePositionCancelRequest: PostCooperationOrderIssuePositionCancelRequest): Observable<PostCooperationOrderIssuePositionCancelResponse> {

        return this.http.post<PostCooperationOrderIssuePositionCancelResponse>(this._SERVER_URL + '/api/Cooperation/CooperationIssue/Position/' + postCooperationOrderIssuePositionCancelRequest.cooperationIssuePositionId + '/Cancel', postCooperationOrderIssuePositionCancelRequest).pipe(
            tap((response: PostCooperationOrderIssuePositionCancelResponse) => {
                return response;
            })
        );
    }
    
    /* COOPERATION TAKEOVERS */

    getCooperationOrderTakeoverPositions(getCooperationOrderTakeoverPositionRequest: GetCooperationOrderTakeoverPositionRequest): Observable<GetCooperationOrderTakeoverPositionResponse> {
        let httpParams: HttpParams = this.toHttpParams(getCooperationOrderTakeoverPositionRequest);

        return this.http.get<GetCooperationOrderTakeoverPositionResponse>(this._SERVER_URL + '/api/Cooperation/CooperationOrder/' + getCooperationOrderTakeoverPositionRequest.cooperationOrderId + '/Takeover/Positions', { params: httpParams }).pipe(
            tap((response: GetCooperationOrderTakeoverPositionResponse) => {
                return response;
            })
        );
    }

    confirmCooperationOrderTakeover(postCooperationOrderTakeoverConfirmRequest: PostCooperationOrderTakeoverConfirmRequest): Observable<PostCooperationOrderTakeoverResponse> {

        return this.http.post<PostCooperationOrderTakeoverResponse>(this._SERVER_URL + '/api/Cooperation/CooperationOrder/' + postCooperationOrderTakeoverConfirmRequest.cooperationOrderId + '/Takeover', postCooperationOrderTakeoverConfirmRequest).pipe(
            tap((response: PostCooperationOrderTakeoverResponse) => {
                return response;
            })
        );
    }

    getCooperationTakeovers(getCooperationTakeoverRequest: GetCooperationTakeoverRequest): Observable<GetCooperationTakeoverResponse> {
        let httpParams: HttpParams = this.toHttpParams(getCooperationTakeoverRequest);

        return this.http.get<GetCooperationTakeoverResponse>(this._SERVER_URL + '/api/Cooperation/CooperationTakeover/' + getCooperationTakeoverRequest.cooperationOrderId, { params: httpParams }).pipe(
            tap((response: GetCooperationTakeoverResponse) => {
                return response;
            })
        );
    }

    getCooperationTakeoverPositions(getCooperationTakeoverPositionRequest: GetCooperationTakeoverPositionRequest): Observable<GetCooperationTakeoverPositionResponse> {
        let httpParams: HttpParams = this.toHttpParams(getCooperationTakeoverPositionRequest);

        return this.http.get<GetCooperationTakeoverPositionResponse>(this._SERVER_URL + '/api/Cooperation/CooperationTakeover/' + getCooperationTakeoverPositionRequest.cooperationTakeoverId + '/Position', { params: httpParams }).pipe(
            tap((response: GetCooperationTakeoverPositionResponse) => {
                return response;
            })
        );
    }

    cancelCooperationOrderTakeover(postCooperationOrderTakeoverCancelRequest: PostCooperationOrderTakeoverCancelRequest): Observable<PostCooperationOrderTakeoverCancelResponse> {

        return this.http.post<PostCooperationOrderTakeoverCancelResponse>(this._SERVER_URL + '/api/Cooperation/CooperationTakeover/' + postCooperationOrderTakeoverCancelRequest.cooperationTakeoverId + '/Cancel', postCooperationOrderTakeoverCancelRequest).pipe(
            tap((response: PostCooperationOrderTakeoverCancelResponse) => {
                return response;
            })
        );
    }

    cancelCooperationOrderTakeoverPosition(postCooperationOrderTakeoverPositionCancelRequest: PostCooperationOrderTakeoverPositionCancelRequest): Observable<PostCooperationOrderTakeoverPositionCancelResponse> {

        return this.http.post<PostCooperationOrderTakeoverPositionCancelResponse>(this._SERVER_URL + '/api/Cooperation/CooperationTakeover/Position/' + postCooperationOrderTakeoverPositionCancelRequest.cooperationTakeoverPositionId + '/Cancel', postCooperationOrderTakeoverPositionCancelRequest).pipe(
            tap((response: PostCooperationOrderTakeoverPositionCancelResponse) => {
                return response;
            })
        );
    }

    //** Warehouse Takeover START */

    getWarehouseTakeovers(getWarehouseTakeoverRequest: GetWarehouseTakeoverRequest): Observable<GetWarehouseTakeoverResponse> {
        let httpParams: HttpParams = this.toHttpParams(getWarehouseTakeoverRequest);

        return this.http.get<GetWarehouseTakeoverResponse>(this._SERVER_URL + '/api/SupplierOrder/WarehouseTakeover', { params: httpParams }).pipe(tap((response: GetWarehouseTakeoverResponse) => {
            return response;
        }));
    }
    
    createWarehouseTakeover(postWarehouseTakeoverRequest: PostWarehouseTakeoverRequest): Observable<PostWarehouseTakeoverResponse> {
        return this.http.post<PostWarehouseTakeoverResponse>(this._SERVER_URL + '/api/SupplierOrder/WarehouseTakeover', postWarehouseTakeoverRequest).pipe(
            tap((response: PostWarehouseTakeoverResponse) => {
                return response;
            })
        );
    }
    
    updateWarehouseTakeover(putWarehouseTakeoverRequest: PutWarehouseTakeoverRequest): Observable<PutWarehouseTakeoverResponse> {
        return this.http.put<PutWarehouseTakeoverResponse>(this._SERVER_URL + '/api/SupplierOrder/WarehouseTakeover/' + putWarehouseTakeoverRequest.supplierOrderId, putWarehouseTakeoverRequest).pipe(
            tap((response: PutWarehouseTakeoverResponse) => {
                return response;
            })
        );
    }

    deleteWarehouseTakeover(deleteWarehouseTakeoverRequest: DeleteWarehouseTakeoverRequest): Observable<DeleteWarehouseTakeoverResponse> {
        return this.http.delete<DeleteWarehouseTakeoverResponse>(this._SERVER_URL + '/api/SupplierOrder/WarehouseTakeover/' + deleteWarehouseTakeoverRequest.supplierOrderId).pipe(
            tap((response: DeleteWarehouseTakeoverResponse) => {
                return response;
            })
        );
    }
    
    
    //** POSITIONS */
    getWarehouseTakeoverPositions(getWarehouseTakeoverPositionsRequest: GetWarehouseTakeoverPositionsRequest): Observable<GetWarehouseTakeoverPositionsResponse> {
        let httpParams: HttpParams = this.toHttpParams(getWarehouseTakeoverPositionsRequest);

        return this.http.get<GetWarehouseTakeoverPositionsResponse>(this._SERVER_URL + '/api/SupplierOrder/WarehouseTakeover/Position', { params: httpParams }).pipe(
            tap((response: GetWarehouseTakeoverPositionsResponse) => {
                return response;
            })
        );
    }
    
    createWarehouseTakeoverPositions(postWarehouseTakeoverPositionsRequest: PostWarehouseTakeoverPositionsRequest): Observable<PostWarehouseTakeoverPositionsResponse> {
        return this.http.post<PostWarehouseTakeoverPositionsResponse>(this._SERVER_URL + '/api/SupplierOrder/WarehouseTakeover/' + postWarehouseTakeoverPositionsRequest.warehouseTakeoverId + '/Positions', postWarehouseTakeoverPositionsRequest).pipe(
            tap((response: PostWarehouseTakeoverPositionsResponse) => {
                return response;
            })
        );
    }

    createWarehouseTakeoverPosition(postWarehouseTakeoverPositionRequest: PostWarehouseTakeoverPositionRequest): Observable<PostWarehouseTakeoverPositionResponse> {
        return this.http.post<PostWarehouseTakeoverPositionResponse>(this._SERVER_URL + '/api/SupplierOrder/WarehouseTakeover/' + postWarehouseTakeoverPositionRequest.warehouseTakeoverId + '/Position', postWarehouseTakeoverPositionRequest).pipe(
            tap((response: PostWarehouseTakeoverPositionResponse) => {
                return response;
            })
        );
    }
    
    updateWarehouseTakeoverPostion(putWarehouseTakeoverPostionRequest: PutWarehouseTakeoverPositionRequest): Observable<PutWarehouseTakeoverPositionResponse> {
        return this.http.put<PutWarehouseTakeoverPositionResponse>(this._SERVER_URL + '/api/SupplierOrder/WarehouseTakeover/Position/' + putWarehouseTakeoverPostionRequest.warehouseTakeoverPositionId, putWarehouseTakeoverPostionRequest).pipe(
            tap((response: PutWarehouseTakeoverPositionResponse) => {
                return response;
            })
        );
    }
    
    
    deleteWarehouseTakeoverPosition(deleteWarehouseTakeoverPositionRequest: DeleteWarehouseTakeoverPositionRequest): Observable<DeleteWarehouseTakeoverPositionResponse> {
        return this.http.delete<DeleteWarehouseTakeoverPositionResponse>(this._SERVER_URL + '/api/SupplierOrder/WarehouseTakeover/Positions/' + deleteWarehouseTakeoverPositionRequest.warehouseTakeoverPositionId).pipe(
            tap((response: DeleteWarehouseTakeoverPositionResponse) => {
                return response;
            })
        );
    }
    
    //** Warehouse Takeover END */

    /* SUPPLIER ORDER POSITION INTERNAL START */

    getSupplierOrderPositionInternal(getSupplierOrderPositionInternalRequest: GetSupplierOrderPositionInternalRequest): Observable<GetSupplierOrderPositionInternalResponse> {
        let httpParams: HttpParams = this.toHttpParams(getSupplierOrderPositionInternalRequest);

        return this.http.get<GetSupplierOrderPositionInternalResponse>(this._SERVER_URL + '/api/SupplierOrder/' + getSupplierOrderPositionInternalRequest.supplierOrderId + '/Position/Internal', { params: httpParams }).pipe(
            tap((response: GetSupplierOrderPositionInternalResponse) => {
                return response;
            })
        );
    }

    /* SUPPLIER ORDER POSITION INTERNAL END */
}