import { Router, type IRouter } from "express";
import {
  CreateAppointmentBody,
  CreateAppointmentResponse,
  CreateOrderBody,
  CreateOrderResponse,
  CreatePropertyBody,
  CreatePropertyResponse,
  CreateViewingRequestBody,
  CreateViewingRequestResponse,
  CalculateFinishingQuoteBody,
  CalculateFinishingQuoteResponse,
  GetDashboardSummaryResponse,
  GetPropertyParams,
  GetPropertyResponse,
  ListFinishingServicesResponse,
  ListProductsQueryParams,
  ListProductsResponse,
  ListProfessionalsQueryParams,
  ListProfessionalsResponse,
  ListPropertiesQueryParams,
  ListPropertiesResponse,
  TogglePropertyFavoriteParams,
  TogglePropertyFavoriteResponse,
} from "@workspace/api-zod";
import {
  appointments,
  favorites,
  finishingServices,
  orders,
  professionals,
  products,
  properties,
  viewingRequests,
} from "../lib/makana-data";

const router: IRouter = Router();

router.get("/properties", (req, res): void => {
  const parsed = ListPropertiesQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { search, listingType, propertyType, governorate, maxPrice, featured } =
    parsed.data;
  const normalizedSearch = search?.toLowerCase();
  const result = properties.filter((property) => {
    const matchesSearch =
      !normalizedSearch ||
      `${property.title} ${property.district} ${property.propertyType}`
        .toLowerCase()
        .includes(normalizedSearch);
    return (
      matchesSearch &&
      (!listingType || property.listingType === listingType) &&
      (!propertyType || property.propertyType === propertyType) &&
      (!governorate || property.governorate === governorate) &&
      (maxPrice === undefined || property.price <= maxPrice) &&
      (featured === undefined || property.featured === featured) &&
      property.status === "Approved"
    );
  });
  res.json(ListPropertiesResponse.parse(result));
});

router.post("/properties", (req, res): void => {
  const parsed = CreatePropertyBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const property = {
    ...parsed.data,
    id: Math.max(...properties.map((item) => item.id)) + 1,
    featured: false,
    status: "Pending Review",
    views: 0,
  };
  properties.push(property);
  res.status(201).json(CreatePropertyResponse.parse(property));
});

router.get("/properties/:id", (req, res): void => {
  const parsed = GetPropertyParams.safeParse(req.params);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const property = properties.find((item) => item.id === parsed.data.id);
  if (!property) {
    res.status(404).json({ error: "Property not found" });
    return;
  }
  property.views = (property.views ?? 0) + 1;
  res.json(GetPropertyResponse.parse(property));
});

router.post("/properties/:id/favorite", (req, res): void => {
  const parsed = TogglePropertyFavoriteParams.safeParse(req.params);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const property = properties.find((item) => item.id === parsed.data.id);
  if (!property) {
    res.status(404).json({ error: "Property not found" });
    return;
  }
  if (favorites.has(property.id)) favorites.delete(property.id);
  else favorites.add(property.id);
  res.json(TogglePropertyFavoriteResponse.parse({ favorite: favorites.has(property.id) }));
});

router.post("/viewing-requests", (req, res): void => {
  const parsed = CreateViewingRequestBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const request = { ...parsed.data, id: viewingRequests.length + 1, status: "Pending" };
  viewingRequests.push(request);
  res.status(201).json(CreateViewingRequestResponse.parse(request));
});

router.get("/finishing-services", (_req, res): void => {
  res.json(ListFinishingServicesResponse.parse(finishingServices));
});

router.post("/finishing-quotes", (req, res): void => {
  const parsed = CalculateFinishingQuoteBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const service = finishingServices.find((item) => item.id === parsed.data.serviceId);
  if (!service) {
    res.status(404).json({ error: "Finishing service not found" });
    return;
  }
  const quote = {
    serviceId: service.id,
    area: parsed.data.area,
    laborPrice: service.laborPrice,
    estimatedCost: Math.round(service.laborPrice * parsed.data.area),
    disclaimer: "التكلفة تقديرية لأعمال التركيب فقط ولا تشمل الخامات.",
  };
  res.json(CalculateFinishingQuoteResponse.parse(quote));
});

router.get("/professionals", (req, res): void => {
  const parsed = ListProfessionalsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { search, category, governorate } = parsed.data;
  const normalizedSearch = search?.toLowerCase();
  const result = professionals.filter((professional) => {
    const matchesSearch =
      !normalizedSearch ||
      `${professional.name} ${professional.title} ${professional.specialty}`
        .toLowerCase()
        .includes(normalizedSearch);
    return (
      matchesSearch &&
      (!category || professional.category === category) &&
      (!governorate || professional.governorate === governorate)
    );
  });
  res.json(ListProfessionalsResponse.parse(result));
});

router.post("/appointments", (req, res): void => {
  const parsed = CreateAppointmentBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const appointment = { ...parsed.data, id: appointments.length + 1, status: "Pending" };
  appointments.push(appointment);
  res.status(201).json(CreateAppointmentResponse.parse(appointment));
});

router.get("/products", (req, res): void => {
  const parsed = ListProductsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { search, category } = parsed.data;
  const normalizedSearch = search?.toLowerCase();
  const result = products.filter((product) => {
    const matchesSearch =
      !normalizedSearch ||
      `${product.name} ${product.vendor} ${product.category}`
        .toLowerCase()
        .includes(normalizedSearch);
    return matchesSearch && (!category || product.category === category);
  });
  res.json(ListProductsResponse.parse(result));
});

router.post("/orders", (req, res): void => {
  const parsed = CreateOrderBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const total = parsed.data.items.reduce((sum, item) => {
    const product = products.find((entry) => entry.id === item.productId);
    return sum + (product?.price ?? 0) * item.quantity;
  }, 0);
  const order = {
    ...parsed.data,
    id: orders.length + 1001,
    status: "Pending",
    total,
  };
  orders.push(order);
  res.status(201).json(CreateOrderResponse.parse(order));
});

router.get("/dashboard/summary", (_req, res): void => {
  res.json(
    GetDashboardSummaryResponse.parse({
      users: 284,
      properties: properties.length + 19,
      pendingProperties: properties.filter((item) => item.status !== "Approved").length + 4,
      publishedProperties: properties.filter((item) => item.status === "Approved").length + 15,
      viewingRequests: viewingRequests.length + 12,
      finishingRequests: 8,
      professionals: professionals.length + 18,
      products: products.length + 42,
      orders: orders.length + 27,
      revenue: 184500,
    }),
  );
});

export default router;